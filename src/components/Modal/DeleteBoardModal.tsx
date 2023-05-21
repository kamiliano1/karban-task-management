import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import ButtonDestructive from "../Layout/Input/Button/ButtonDestructive";
import ButtonPrimarySmall from "../Layout/Input/Button/ButtonPrimarySmall";
import ButtonSecondary from "../Layout/Input/Button/ButtonSecondary";
import { useRecoilState } from "recoil";
import { settingsModalState } from "../../atoms/settingsModalAtom";
import { modalState } from "../../atoms/modalAtom";
import { boardsState } from "../../atoms/boardsAtom";

type DeleteBoardModalProps = { darkMode: boolean };

const DeleteBoardModal: React.FC<DeleteBoardModalProps> = ({ darkMode }) => {
  const [settingState, setSettingState] = useRecoilState(settingsModalState);
  const [modalStates, setModalStates] = useRecoilState(modalState);
  const [boardState, setBoardState] = useRecoilState(boardsState);

  const deleteBoard = () => {
    console.log(settingState.activeBoard);
    console.log(
      boardState.find((item) => item.name === settingState.activeBoard)
    );
    setBoardState((prev) =>
      prev.filter((item) => item.name != settingState.activeBoard)
    );
    setModalStates((prev) => ({ ...prev, open: false }));
    setSettingState((prev) => ({ ...prev, activeBoard: boardState[0].name }));
  };
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content
        className={`data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] z-[500] max-w-[450px]
       translate-x-[-50%] translate-y-[-50%] rounded-[6px] ${
         darkMode ? "bg-darkGrey" : "bg-white"
       }
        p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]
        focus:outline-none`}
      >
        <Dialog.Title className="text-red text-800  pb-6">
          Delete this board?
        </Dialog.Title>

        <Dialog.Description className={` pb-4 text-500 text-mediumGrey`}>
          Are you sure you want to delete the `{settingState.activeBoard}` task
          and its subtasks? This action cannot be reversed.
        </Dialog.Description>
        <div className="sm:flex sm:gap-4">
          <ButtonDestructive buttonLabel="Delete" buttonAction={deleteBoard} />
          <ButtonSecondary
            buttonLabel="Cancel"
            darkMode={darkMode}
            buttonAction={() => {
              setModalStates((prev) => ({ ...prev, open: false }));
            }}
            cssClasses="mt-2 sm:mt-0"
          />
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};
export default DeleteBoardModal;
