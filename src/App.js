import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";
import {
  AlignPlugin,
  BalloonToolbar,
  BlockquotePlugin,
  BoldPlugin,
  CodeBlockPlugin,
  CodePlugin,
  withList,
  decorateSearchHighlight,
  EditablePlugins,
  ExitBreakPlugin,
  HeadingPlugin,
  HeadingToolbar,
  HighlightPlugin,
  ImagePlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  MARK_UNDERLINE,
  MediaEmbedPlugin,
  MentionPlugin,
  MentionSelect,
  ParagraphPlugin,
  ResetBlockTypePlugin,
  pipe,
  SearchHighlightPlugin,
  SoftBreakPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  TablePlugin,
  TodoListPlugin,
  ToolbarAlign,
  ToolbarElement,
  ToolbarImage,
  ToolbarLink,
  ToolbarList,
  ToolbarMark,
  ToolbarSearchHighlight,
  UnderlinePlugin,
  useMention,
  withAutoformat,
  withDeserializeHTML,
  withImageUpload,
  withInlineVoid,
  withLink,
  deserializeHTMLToDocumentFragment,
  withNormalizeTypes,
  withTable,
  withTrailingNode,
  serializeHTMLFromNodes,
  withMarks,
  KbdPlugin,
  MARK_KBD,
} from "@udecode/slate-plugins";
import { MENTIONABLES } from "./mentionables";
import { autoformatRules } from "./autoformatRules";
import {
  headingTypes,
  initialValueAutoformat,
  initialValueBasicElements,
  initialValueBasicMarks,
  initialValueEmbeds,
  initialValueExitBreak,
  initialValueForcedLayout,
  initialValueHighlight,
  initialValueImages,
  initialValueLinks,
  initialValueList,
  initialValueMentions,
  initialValuePasteHtml,
  initialValueSoftBreak,
  initialValueTables,
  options,
  optionsResetBlockTypes,
} from "./initialValues";
const plugins = [
  ParagraphPlugin(options),
  BlockquotePlugin(options),
  TodoListPlugin(options),
  HeadingPlugin(options),
  ImagePlugin(options),
  LinkPlugin(options),
  KbdPlugin(options),
  ListPlugin(options),
  MentionPlugin(options),
  TablePlugin(options),
  AlignPlugin(options),
  MediaEmbedPlugin(options),
  CodeBlockPlugin(options),
  BoldPlugin(options),
  CodePlugin(options),
  ItalicPlugin(options),
  HighlightPlugin(options),
  SearchHighlightPlugin(options),
  UnderlinePlugin(options),
  StrikethroughPlugin(options),
  SubscriptPlugin(options),
  SuperscriptPlugin(options),
  ResetBlockTypePlugin(optionsResetBlockTypes),
  SoftBreakPlugin({
    rules: [
      { hotkey: "shift+enter" },
      {
        hotkey: "enter",
        query: {
          allow: [
            options.code_block.type,
            options.blockquote.type,
            options.td.type,
          ],
        },
      },
    ],
  }),
  ExitBreakPlugin({
    rules: [
      {
        hotkey: "mod+enter",
      },
      {
        hotkey: "mod+shift+enter",
        before: true,
      },
      {
        hotkey: "enter",
        query: {
          start: true,
          end: true,
          allow: headingTypes,
        },
      },
    ],
  }),
];
const withPlugins = [
  withReact,
  withHistory,
  withTable(options),
  withLink(options),
  withList(options),
  withDeserializeHTML({ plugins }),
  withImageUpload(),
  withAutoformat({ rules: autoformatRules }),
  withMarks(),
  withNormalizeTypes({
    rules: [{ path: [0, 0], strictType: options.h1.type }],
  }),
  withTrailingNode({ type: options.p.type, level: 1 }),
  withInlineVoid({ plugins }),
];
const initialValue = [
  ...initialValueForcedLayout,
  ...initialValueBasicMarks,
  ...initialValueHighlight,
  ...initialValueBasicElements,
  ...initialValueList,
  ...initialValueTables,
  ...initialValueLinks,
  ...initialValueMentions,
  ...initialValueImages,
  ...initialValueEmbeds,
  ...initialValueAutoformat,
  ...initialValueSoftBreak,
  ...initialValueExitBreak,
  ...initialValuePasteHtml,
  {
    children: deserializeHTMLToDocumentFragment({
      plugins,
      element: "<p>Deserialized paragraph here.</p>",
    }),
  },
];
const App = () => {
  const [value, setValue] = useState(initialValue);
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);
  const [search, setSearchHighlight] = useState("");
  const decorate = [decorateSearchHighlight({ search })];
  const {
    index,
    search: mentionSearch,
    values,
    target,
    onChangeMention,
    onKeyDownMention,
  } = useMention(MENTIONABLES, {
    maxSuggestions: 10,
  });
  const onKeyDown = [onKeyDownMention];
  return React.createElement(
    Slate,
    {
      editor: editor,
      value: value,
      onChange: (newValue) => {
        setValue(newValue);
        if (JSON.stringify(newValue) !== JSON.stringify(value)) {
          const serializedHTML = serializeHTMLFromNodes({
            plugins,
            nodes: newValue,
          });
          console.log("serialized nodes", serializedHTML);
        }
        onChangeMention(editor);
      },
    },
    React.createElement(ToolbarSearchHighlight, {
      icon: () => React.createElement("div", null),
      setSearch: setSearchHighlight,
    }),
    React.createElement(
      HeadingToolbar,
      null,
      React.createElement(ToolbarElement, { type: options.h1.type, icon: 1 }),
      React.createElement(ToolbarElement, { type: options.h2.type, icon: 2 }),
      React.createElement(ToolbarElement, { type: options.h3.type, icon: 3 }),
      React.createElement(ToolbarElement, { type: options.h4.type, icon: 4 }),
      React.createElement(ToolbarElement, { type: options.h5.type, icon: 5 }),
      React.createElement(ToolbarElement, { type: options.h6.type, icon: 6 }),
      React.createElement(ToolbarMark, { type: MARK_BOLD, icon: "B" }),
      React.createElement(ToolbarMark, { type: MARK_ITALIC, icon: "I" }),
      React.createElement(ToolbarMark, { type: MARK_UNDERLINE, icon: "U" }),
      React.createElement(ToolbarMark, { type: MARK_STRIKETHROUGH, icon: "S" }),
      React.createElement(ToolbarMark, { type: MARK_CODE, icon: "C" }),
      React.createElement(ToolbarMark, { type: MARK_KBD, icon: "K" }),
      React.createElement(ToolbarMark, {
        type: MARK_SUPERSCRIPT,
        clear: MARK_SUBSCRIPT,
        icon: "SP",
      }),
      React.createElement(ToolbarMark, {
        type: MARK_SUBSCRIPT,
        clear: MARK_SUPERSCRIPT,
        icon: "SB",
      }),
      React.createElement(
        ToolbarList,
        Object.assign({}, options, { typeList: options.ul.type, icon: "UL" })
      ),
      React.createElement(
        ToolbarList,
        Object.assign({}, options, { typeList: options.ol.type, icon: "OL" })
      ),
      React.createElement(ToolbarElement, {
        type: options.blockquote.type,
        icon: "BQ",
      }),
      React.createElement(ToolbarElement, {
        type: options.code_block.type,
        icon: "CB",
      }),
      React.createElement(ToolbarAlign, { icon: "al" }),
      React.createElement(ToolbarAlign, {
        type: options.align_center.type,
        icon: "ac",
      }),
      React.createElement(ToolbarAlign, {
        type: options.align_right.type,
        icon: "ar",
      }),
      React.createElement(
        ToolbarLink,
        Object.assign({}, options, { icon: "A" })
      ),
      React.createElement(
        ToolbarImage,
        Object.assign({}, options, { icon: "IMG" })
      )
    ),
    React.createElement(
      BalloonToolbar,
      { arrow: true },
      React.createElement(ToolbarMark, {
        reversed: true,
        type: MARK_BOLD,
        icon: "B",
        tooltip: { content: "Bold (⌘B)" },
      }),
      React.createElement(ToolbarMark, {
        reversed: true,
        type: MARK_ITALIC,
        icon: "I",
        tooltip: { content: "Italic (⌘I)" },
      }),
      React.createElement(ToolbarMark, {
        reversed: true,
        type: MARK_UNDERLINE,
        icon: "U",
        tooltip: { content: "Underline (⌘U)" },
      })
    ),
    React.createElement(MentionSelect, {
      at: target,
      valueIndex: index,
      options: values,
    }),
    React.createElement(EditablePlugins, {
      style: {
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      },
      plugins: plugins,
      decorate: decorate,
      decorateDeps: [search],
      renderLeafDeps: [search],
      onKeyDown: onKeyDown,
      onKeyDownDeps: [index, mentionSearch, target],
      placeholder: "Enter some plain text...",
    })
  );
};


export default App;
