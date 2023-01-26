// import createAlignmentPlugin from "@draft-js-plugins/alignment";
// import "@draft-js-plugins/alignment/lib/plugin.css";
import DraftEditor, { composeDecorators } from "@draft-js-plugins/editor";
import createFocusPlugin from "@draft-js-plugins/focus";
import "@draft-js-plugins/focus/lib/plugin.css";
import createImagePlugin from "@draft-js-plugins/image";
import "@draft-js-plugins/image/lib/plugin.css";
import createResizeablePlugin from "@draft-js-plugins/resizeable";
import {
  CompositeDecorator,
  ContentState,
  convertFromHTML,
  DraftHandleValue,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  RichUtils,
  SyntheticKeyboardEvent,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { useRouter } from "next/router";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { Dispatch, useEffect, useRef } from "react";
import Toolbar from "../toolbar";

// const imagePlugin = createImagePlugin();

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
// const alignmentPlugin = createAlignmentPlugin();
// const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  // alignmentPlugin.decorator,
  focusPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
}

const Link = (props) => {
  const { url, linkText } = props.contentState
    .getEntity(props.entityKey)
    .getData();
  return (
    <a
      href={url}
      style={{
        color: "#006cb7",
        textDecoration: "underline",
        cursor: "pointer",
      }}
      onClick={(e) => {
        window.open(url, "_blank");
      }}
    >
      {linkText || props.children}
    </a>
  );
};

const customDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

const GENERATE_COPY = "GENERATE_COPY";

export interface QuillContentInput {
  insert: string;
  attributes?: { [key: string]: string | number | boolean };
}

export enum InlineStyle {
  _BOLD = "BOLD",
  _ITALIC = "ITALIC",
  _UNDERLINE = "UNDERLINE",
}

export enum BlockStyle {
  _H1 = "header-one",
  _H2 = "header-two",
  _ORDERED_LIST = "ordered-list-item",
  _UNORDERED_LIST = "unordered-list-item",
}

interface EditorProps {
  content: { isDelta: boolean; data: QuillContentInput[] | any };
  editorState: EditorState;
  setEditorState: Dispatch<any>;
  handleGenerate: () => Promise<void>;
}

const Editor: React.FC<EditorProps> = ({
  content,
  editorState,
  setEditorState,
  handleGenerate,
}) => {
  const mounted = useRef(false);
  const router = useRouter();
  const { hasCommandModifier } = KeyBindingUtil;
  const editorRef = useRef<DraftEditor>(null);
  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const setInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const setBlockStyle = (style: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, style));
  };

  useEffect(() => {
    let html = "";
    if (content?.isDelta) {
      var converter = new QuillDeltaToHtmlConverter(content?.data?.ops, cfg);
      var cfg = {};
      html = converter.convert();
    } else {
      html = content?.data ?? "";
    }
    const blocksFromHTML = convertFromHTML(html);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(
      EditorState.createWithContent(contentState, customDecorator)
    );
  }, [content, setEditorState]);

  function myKeyBindingFn(e: SyntheticKeyboardEvent): string | null {
    if (e.keyCode === 13 /* `S` key */ && hasCommandModifier(e)) {
      return GENERATE_COPY;
    }
    return getDefaultKeyBinding(e);
  }

  const handleKeyCommand = (command: string): DraftHandleValue => {
    if (command === GENERATE_COPY) {
      handleGenerate();
      return "handled";
    } else if (command === "bold") {
      setInlineStyle(InlineStyle._BOLD);
      return "handled";
    } else if (command === "italic") {
      setInlineStyle(InlineStyle._ITALIC);
      return "handled";
    } else if (command === "underline") {
      setInlineStyle(InlineStyle._UNDERLINE);
      return "handled";
    }
    return "not-handled";
  };

  return (
    <div className="flex flex-col m-3 overflow-y-auto">
      <div className="sticky top-0 z-10">
        <Toolbar
          editorState={editorState}
          setEditorState={setEditorState}
          setInlineStyle={setInlineStyle}
          setBlockStyle={setBlockStyle}
          editorRef={editorRef}
        />
      </div>
      {imagePlugin && (
        <div className="flex-1 bg-white relative px-3 pb-3">
          <DraftEditor
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={myKeyBindingFn}
            ref={editorRef}
            plugins={[
              focusPlugin,
              resizeablePlugin,
              // alignmentPlugin,
              imagePlugin,
            ]}
          />
          {/* <AlignmentTool /> */}
        </div>
      )}
    </div>
  );
};

export default Editor;
