import { useRouter } from "next/router";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { saveAiArticleWriter } from "../../../../../api/history";
import { setAiArticleQuill } from "../../../../../store/articleWriter/actions";
import Overlay from "../../../overlay";

export interface QuillContentInput {
  insert?: string | object;
  attributes?: { [key: string]: string | number | boolean };
}

interface EditorProps {
  copyId: string;
  content: { isDelta: boolean; data: QuillContentInput[] | any };
  isLoading: boolean;
  handleHotkey: (range, context) => void;
  quill: any;
}

const Editor: React.FC<EditorProps> = ({
  copyId,
  content,
  isLoading,
  handleHotkey,
  quill,
}) => {
  const dispatch = useDispatch();
  const QuillRef = useRef(null);
  const mounted = useRef(false);
  const [delta, setDelta] = useState(null);
  const router = useRouter();
  const { projectId, historyId, teamId, customerId } = router.query;

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function initialize() {
      // we make a dynamic import for the QuillJS, as this component is not made to work on SSR
      QuillRef.current = (await import("quill/dist/quill.min.js")).default;
      // var bindings = {
      //   custom1: {
      //     key: "enter",
      //     ctrlKey: true,
      //     handler: handleHotkey,
      //   },
      //   custom2: {
      //     key: "enter",
      //     ctrlKey: true,
      //     handler: handleHotkey,
      //   },
      // };
      const quillElement = document.querySelector('[data-toggle="quill"]');
      if (!quillElement) {
        return;
      }
      dispatch(
        setAiArticleQuill(
          new QuillRef.current(quillElement, {
            // modules: {
            //   keyboard: {
            //     bindings: bindings,
            //   },
            // },
            placeholder: "Your article will appear here.",
            theme: "snow",
          })
        )
      );
    }
    try {
      initialize();
    } catch (err) {}

    // return () => {
    //   const elToolbars = document.querySelectorAll(".ql-toolbar");
    //   elToolbars.forEach((elToolbar) => {
    //     elToolbar.remove();
    //   });
    //   const elEditors = document.querySelectorAll(".ql-editor");
    //   elEditors.forEach((elEditor) => {
    //     elEditor.remove();
    //   });
    // };
  }, [dispatch]);

  useEffect(() => {
    if (!quill || !content?.data) {
      return;
    }
    if (!content?.isDelta) {
      quill.setContents(content?.data);
    } else {
      quill.setContents(content?.data);
    }
  }, [content, quill]);

  const onEditorChange = useCallback(
    (eventType, range) => {
      if (!quill) {
        return;
      }
      setDelta(quill.getContents());
    },
    [quill]
  );

  useEffect(() => {
    if (!delta || !projectId || !historyId) {
      return;
    }
    const timeId = setTimeout(async () => {
      try {
        await saveAiArticleWriter({
          teamId,
          customerId,
          data: {
            project_id: projectId,
            history_id: historyId,
            copy_id: copyId,
            content: delta,
          },
        });
      } catch (err) {}
    }, 500);

    return () => {
      clearTimeout(timeId);
    };
  }, [copyId, customerId, delta, historyId, projectId, teamId]);

  useEffect(() => {
    if (!quill || !QuillRef || !QuillRef.current || !QuillRef.current.events) {
      return;
    }

    quill.on(QuillRef.current.events.EDITOR_CHANGE, onEditorChange);

    return () => {
      quill.off(QuillRef.current.events.EDITOR_CHANGE, onEditorChange);
    };
  }, [onEditorChange, quill]);

  return (
    <div className="relative" id="article-writer-quill-container">
      <div
        id="article-writer-quill"
        data-quill-placeholder="Quill WYSIWYG"
        data-toggle="quill"
      />
      <Overlay isShowing={isLoading} hideLoader />
    </div>
  );
};

const mapStateProps = (state) => {
  return {
    quill: state.articleWriter?.quill,
  };
};

export default connect(mapStateProps)(Editor);
