import React, { useEffect, useState } from "react";
import { settingsModalState } from "../../atoms/settingsModalAtom";
import { BoardsAtom, boardsState } from "../../atoms/boardsAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import BoardColumn from "./BoardColumn";
import { BoardType, ColumnType, SubtasksType, TaskType } from "./BoardType";
import { customAlphabet } from "nanoid";

import { modalState } from "@/src/atoms/modalAtom";
import AddColumn from "./AddColumn";
import NoColumnSection from "./NoColumnSection";
import NoBoardSection from "./NoBoardSection";
type BoardProps = {};

const Board: React.FC<BoardProps> = () => {
  const nanoid = customAlphabet("1234567890", 15);
  const settingState = useRecoilValue(settingsModalState);
  const [modalsState, setModalsState] = useRecoilState(modalState);
  const [boardState, setBoardState] = useRecoilState(boardsState);
  const [newBoardState, setNewBoardState] = useState<BoardType[]>(boardState);
  const [loading, setLoading] = useState<boolean>(true);
  const [activatedBoard, setActivatedBoard] = useState<BoardType>(
    boardState[0]
  );
  useEffect(() => {
    if (loading) {
      fetch("data/data.json")
        .then((res) => res.json())
        .then((data) => {
          setBoardState(data.boards);
          setBoardState((prev) =>
            prev.map((item) => {
              let subTask: SubtasksType;
              let letTask: TaskType;
              let letColumn: ColumnType;
              let letBoard: BoardType;
              letBoard = { ...item, columns: [] };
              item.columns.map((cols) => {
                letColumn = { ...cols, id: parseInt(nanoid()), tasks: [] };
                cols.tasks.map((task) => {
                  letTask = { ...task, id: parseInt(nanoid()), subtasks: [] };
                  task.subtasks.map((subtask) => {
                    subTask = { ...subtask, id: parseInt(nanoid()) };
                    letTask = {
                      ...letTask,
                      subtasks: [...letTask.subtasks, subTask],
                    };
                  });
                  letColumn = {
                    ...letColumn,
                    tasks: [...letColumn.tasks, letTask],
                  };
                });
                letBoard = {
                  ...letBoard,
                  columns: [...letBoard.columns, letColumn],
                };
              });
              return letBoard;
            })
          );
        });
      setLoading(false);
    }
  }, [loading, nanoid, setBoardState]);
  const darkMode = settingState.darkMode;
  const activeBoard = settingState.activeBoard;
  useEffect(() => {
    setNewBoardState(boardState);
  }, [boardState]);
  useEffect(() => {
    setActivatedBoard(
      boardState.filter((board) => board.name === activeBoard)[0]
    );
  }, [activeBoard, boardState, settingState]);

  const activatedColumns = activatedBoard
    ? activatedBoard.columns.map((item, number) => (
        <BoardColumn
          key={item.id}
          columnName={item.name}
          tasks={item.tasks}
          taskQty={item.tasks.length}
          columnId={item.id}
          columnNumber={number}
        />
      ))
    : [];
  return (
    <div
      className={`${
        darkMode ? "bg-veryDarkGrey" : "bg-white"
      } w-full flex z-[-300] overflow-x-auto h-[calc(100vh_-_clamp(64.75px,_10vw,_97px))] ${
        !activatedColumns.length && "justify-center"
      }
    pt-6 pr-6 ${
      settingState.isSidebarOpen && "pl-[clamp(285px,_23vw,_300px)]"
    }`}>
      {boardState.length ? (
        <>
          {activatedColumns.length ? (
            <>
              {activatedColumns}
              <AddColumn />
            </>
          ) : (
            <NoColumnSection />
          )}
        </>
      ) : (
        <NoBoardSection />
      )}
    </div>
  );
};
export default Board;
