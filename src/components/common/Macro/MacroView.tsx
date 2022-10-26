import { Box } from "@material-ui/core";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { createEditor, Editor, Element as SlateElement, Point, Range, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, useSlateStatic, withReact } from "slate-react";
import { TemplateType } from "../../../constants";
import { MacroPayload, MacrosPayload, useFetchAllMacrosLazyQuery, useUpdateHpiNotesMutation, useUpdatePeNotesMutation, useUpdateRosNotesMutation } from "../../../generated/graphql";
import { MacroViewTypes, ParamsType } from "../../../interfacesTypes";
import { GREY } from "../../../theme";
import { getMacroTextInitialValue } from "../../../utils";

const MacroView: FC<MacroViewTypes> = ({ itemId, setItemId, notes, type }) => {
  const { appointmentId, id: patientId } = useParams<ParamsType>()
  const [value, setValue] = useState([{
    type: 'paragraph',
    children: [{ text: '' }]
  }])
  const [searchString, setSearchString] = useState('')
  const [shouldShowList, setShouldShowList] = useState(false)
  const [macros, setMacros] = useState<MacrosPayload['macros']>()

  const [fetchAllMacros] = useFetchAllMacrosLazyQuery({
    onCompleted: (data) => {
      const { fetchAllMacros } = data || {}
      const { macros, response } = fetchAllMacros || {}
      const { status } = response || {}
      if (status === 200) {
        setMacros(macros)
      }
    }
  })

  const findAllMacros = useCallback(async () => {
    await fetchAllMacros({
      variables: {
        macroInput: {
          paginationOptions: { limit: 40, page: 1 },
          searchString
        }
      }
    })
  }, [fetchAllMacros, searchString])

  useEffect(() => {
    findAllMacros()
  }, [findAllMacros])

  const [updateRosNotes] = useUpdateRosNotesMutation({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,

    onCompleted(data) {
      if (data) {
        const { updateROSNotes } = data
        const { reviewOfSystem } = updateROSNotes || {}
        const { id } = reviewOfSystem || {}
        setItemId(id)
      }
    }
  });

  const [updatePeNotes] = useUpdatePeNotesMutation({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,

    onCompleted(data) {
      if (data) {
        const { updatePENotes } = data
        const { physicalExam } = updatePENotes || {}
        const { id } = physicalExam || {}
        setItemId(id)
      }
    }
  });

  const [updateHpiNotes] = useUpdateHpiNotesMutation({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,

    onCompleted(data) {
      if (data) {
        const { updateHPINotes } = data
        const { patientIllnessHistory } = updateHPINotes || {}
        const { id } = patientIllnessHistory || {}
        setItemId(id)
      }
    }
  });

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const editor: any = useMemo(
    () => withCustomSlate(withHistory(withReact(createEditor()))),
    []
  );

  useEffect(() => {
    if (notes) {
      editor.children = JSON.parse(notes)
    }
  }, [editor, notes])

  useEffect(() => {
    const textWith = value[0].children[0].text
    if (textWith.at(0) === '.') {
      setSearchString(textWith.slice(1, textWith.length))
      setShouldShowList(true)
    } else {
      setShouldShowList(false)
    }
  }, [value])

  const handleNotesSave = useCallback((value) => {
    try {
      if (type === TemplateType.REVIEW_OF_SYSTEM) {
        updateRosNotes({
          variables: {
            updateNotes: {
              appointmentId,
              notes: value,
              patientId: patientId,
              id: itemId
            }
          }
        })
      } else if (type === TemplateType.HPI) {
        updateHpiNotes({
          variables: {
            updateNotes: {
              appointmentId,
              notes: value,
              patientId: patientId,
              id: itemId
            }
          }
        })
      } else if (type === TemplateType.PHYSICAL_EXAM) {
        updatePeNotes({
          variables: {
            updateNotes: {
              appointmentId,
              notes: value,
              patientId: patientId,
              id: itemId
            }
          }
        })
      }
    } catch (error) { }
  }, [appointmentId, itemId, patientId, type, updateHpiNotes, updatePeNotes, updateRosNotes])

  const handleMacroClick = (editor: Editor, macro: MacroPayload['macro']) => {
    const macroValue = getMacroTextInitialValue(macro?.expansion || '')
    const transformedValues = value.filter((transformedValue) => !transformedValue.children[0].text.includes('.'))
    handleNotesSave(JSON.stringify([...transformedValues, ...macroValue]))
    editor.children = [...transformedValues, ...macroValue]
    setShouldShowList(false)
  }

  if (value) {
    return (
      <Box pb={1}>
        <Slate
          editor={editor}
          value={value}
          onChange={async (changeValue: any) => {
            const content = JSON.stringify(changeValue)
            await localStorage.setItem('content', content)
            handleNotesSave(JSON.stringify(changeValue))
            return setValue(changeValue);
          }}
        >

          <Box
            bgcolor={GREY} borderRadius={4} minHeight={48} m={2} mt={0} p={2} display='flex'
            flexDirection='column' justifyContent='center'>
            <Editable
              renderElement={renderElement}
              placeholder="Get to work…"
              spellCheck
            />
          </Box>

          <Box mx={2} maxWidth={300} maxHeight={300} position="absolute" className="z-index overflow-auto">
            {shouldShowList &&
              <ul className="macro-ul word-wrap">
                {macros?.map((macro) => {
                  return (
                    <li className="pointer-cursor" onClick={() => handleMacroClick(editor, macro)}>{macro?.shortcut}</li>
                  )
                })}
              </ul>
            }
          </Box>
        </Slate>
      </Box>
    );
  }
  return <></>
};
const withCustomSlate = (editor: Editor) => {
  const { deleteBackward } = editor;
  editor.deleteBackward = (...args) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [match]: any = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          ["drop-down-item", "date", "time"].includes((n as any).type)
      });
      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);
        if (Point.equals(selection.anchor, start)) {
          const newProperties = {
            type: "paragraph"
          };
          Transforms.setNodes<any>(editor, newProperties, {
            match: (n) =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              ["drop-down-item", "date", "time"].includes((n as any).type)
          });
          return;
        }
      }
    }
    deleteBackward(...args);
  };
  return editor;
};
const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "drop-down-item":
      return <CheckListItemElement {...props} />;
    case "date":
      return <DateElement {...props} />;
    case "time":
      return <TimeElement {...props} />;
    default:

      return (
        <span
          {...attributes}
          contentEditable={true}
        >
          {children}
        </span>
      );
  }
};
const CheckListItemElement = ({ attributes, children, element }: any) => {
  const editor: any = useSlateStatic();
  const { options, defaultValue, value } = element;
  if (!options?.length) {
    return <></>;
  }
  return (
    <React.Fragment
      {...attributes}
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <span {...attributes}>
        <span contentEditable={true}>
          <span
            contentEditable={false}
            style={{ marginRight: "0.75rem" }}
          >
            <select
              name="example"
              onChange={(event) => {
                const path = ReactEditor.findPath(editor, element);
                const newProperties = {
                  value: event.target.value
                };
                Transforms.setNodes<any>(editor, newProperties, { at: path });
              }}
              defaultValue={value || defaultValue}
            >
              {options?.map((optionValue: string) => {
                return <option value={optionValue}>{optionValue}</option>;
              })}
            </select>
          </span>
        </span>
        {children}
      </span>
    </React.Fragment>
  );
};
const DateElement = ({ attributes, children, element }: any) => {
  const editor: any = useSlateStatic();
  const { value } = element;
  return (
    <React.Fragment
      {...attributes}
    >
      <span
        contentEditable={false}
      >
        <input
          type="date"
          value={value}
          onChange={(event) => {
            const path = ReactEditor.findPath(editor, element);
            const newProperties = {
              value: event.target.value
            };
            Transforms.setNodes<any>(editor, newProperties, { at: path });
          }}
        />
      </span>
    </React.Fragment>
  );
};
const TimeElement = ({ attributes, children, element }: any) => {
  const editor: any = useSlateStatic();
  const { value } = element;
  return (
    <React.Fragment
      {...attributes}
    >
      <span
        contentEditable={false}
      >
        <input
          type="time"
          value={value}
          onChange={(event) => {
            const path = ReactEditor.findPath(editor, element);
            const newProperties = {
              value: event.target.value
            };
            Transforms.setNodes<any>(editor, newProperties, { at: path });
          }}
        />
      </span>
    </React.Fragment>
  );
};
export default MacroView;