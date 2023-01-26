import DraftEditor from "@draft-js-plugins/editor";
import { AtomicBlockUtils, EditorState, Modifier, RichUtils } from "draft-js";
import { Dispatch, MutableRefObject, useEffect, useState } from "react";
import countWords from "../../../../../../utils/countWords";
import AddImageModal from "../../../../modals/addImageModal";
import { BlockStyle, InlineStyle } from "../editor";
import BoldTool from "./toolItems/boldTool";
import BulletListTool from "./toolItems/bulletListTool";
import ClearFormatTool from "./toolItems/clearFormatTool";
import Head1SizeTool from "./toolItems/head1SizeTool";
import Head2SizeTool from "./toolItems/head2SizeTool";
import ImageTool from "./toolItems/imageTool";
import ItalicTool from "./toolItems/italicTool";
import NumberedListTool from "./toolItems/numberedListTool";
import UnderlineTool from "./toolItems/underlineTool";

interface ToolbarProps {
  editorState: EditorState;
  setEditorState: Dispatch<any>;
  setInlineStyle: (style: string) => void;
  setBlockStyle: (style: string) => void;
  editorRef: MutableRefObject<DraftEditor>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  editorState,
  setEditorState,
  setInlineStyle,
  setBlockStyle,
  editorRef,
}) => {
  const [selectedBold, setSelectedBold] = useState<boolean>(false);
  const [selectedItalic, setSelectedItalic] = useState<boolean>(false);
  const [selectedUnderline, setSelectedUnderline] = useState<boolean>(false);
  const [selectedHeader1, setSelectedHeader1] = useState<boolean>(false);
  const [selectedHeader2, setSelectedHeader2] = useState<boolean>(false);
  const [selectedBullet, setSelectedBullet] = useState<boolean>(false);
  const [selectedNumbered, setSelectedNumbered] = useState<boolean>(false);
  const [countOfWords, setCountWords] = useState<number>(0);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);

  useEffect(() => {
    setSelectedBold(
      editorState?.getCurrentInlineStyle()?.has(InlineStyle._BOLD)
    );
    setSelectedItalic(
      editorState?.getCurrentInlineStyle()?.has(InlineStyle._ITALIC)
    );
    setSelectedUnderline(
      editorState?.getCurrentInlineStyle()?.has(InlineStyle._UNDERLINE)
    );
    var startKey = editorState.getSelection().getStartKey();
    setSelectedHeader1(
      editorState?.getCurrentContent().getBlockForKey(startKey).getType() ===
        BlockStyle._H1
    );
    setSelectedHeader2(
      editorState?.getCurrentContent().getBlockForKey(startKey).getType() ===
        BlockStyle._H2
    );
    setSelectedBullet(
      editorState?.getCurrentContent().getBlockForKey(startKey).getType() ===
        BlockStyle._UNORDERED_LIST
    );
    setSelectedNumbered(
      editorState?.getCurrentContent().getBlockForKey(startKey).getType() ===
        BlockStyle._ORDERED_LIST
    );
    setCountWords(
      countWords(editorState?.getCurrentContent()?.getPlainText() ?? "")
    );
  }, [editorRef, editorState]);

  const clearStyles = () => {
    const contentState = editorState.getCurrentContent();
    const contentWithoutStyles = Object.values(InlineStyle)
      .map((v) => v)
      .reduce(
        (newContentState, style) =>
          Modifier.removeInlineStyle(
            newContentState,
            editorState.getSelection(),
            style
          ),
        contentState
      );

    const newEditorState = EditorState.push(
      editorState,
      contentWithoutStyles,
      "change-inline-style"
    );

    setEditorState(RichUtils.toggleBlockType(newEditorState, "unstyled"));
  };

  const addImage = (url: string) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
    );
  };

  return (
    <div className="flex justify-between items-center bg-white p-2 border-b border-gray-200">
      <div className="flex gap-2">
        <BoldTool
          onClick={() => setInlineStyle(InlineStyle._BOLD)}
          selected={selectedBold}
        />
        <ItalicTool
          onClick={() => setInlineStyle(InlineStyle._ITALIC)}
          selected={selectedItalic}
        />
        <UnderlineTool
          onClick={() => setInlineStyle(InlineStyle._UNDERLINE)}
          selected={selectedUnderline}
        />
        <div className="border-r border-gray-200"></div>
        <Head1SizeTool
          onClick={() => setBlockStyle(BlockStyle._H1)}
          selected={selectedHeader1}
        />
        <Head2SizeTool
          onClick={() => setBlockStyle(BlockStyle._H2)}
          selected={selectedHeader2}
        />
        {/* <div className="border-r border-gray-200"></div>
      <LinkTool /> */}
        <div className="border-r border-gray-200"></div>
        <BulletListTool
          onClick={() => setBlockStyle(BlockStyle._UNORDERED_LIST)}
          selected={selectedBullet}
        />
        <NumberedListTool
          onClick={() => setBlockStyle(BlockStyle._ORDERED_LIST)}
          selected={selectedNumbered}
        />
        <div className="border-r border-gray-200"></div>
        <ClearFormatTool onClick={clearStyles} />
        <div className="border-r border-gray-200"></div>
        <ImageTool onClick={() => setIsOpenAddModal(true)} />
      </div>
      <p className="text-gray-5 text-md p-2">{countOfWords} words</p>
      <AddImageModal
        isOpenModal={isOpenAddModal}
        setIsOpenModal={setIsOpenAddModal}
        onAdd={addImage}
      />
    </div>
  );
};

export default Toolbar;
