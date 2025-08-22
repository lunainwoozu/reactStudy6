import { useEffect } from "react";
import ProgressBar from "./ProgressBar";

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    console.log('timer set');
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER) // 3초 뒤 자동 장소 및 모달 닫기

    return () => {
      console.log('cleaning up timer');
      clearTimeout(timer)
    } // 해당 타이머 정지(event.preventDefault() 역할)
  }, [onConfirm])
  
  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  );
}
