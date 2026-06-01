"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUIStore } from "@/store/ui-store";
import AddEventForm from "../add-event-form";

export default function AddReminderModal({
  refresh,
  editingEvent,
  clearEditing,
}: {
  refresh: () => void;
  editingEvent: any;
  clearEditing: () => void;
}) {
  const {
    addReminderOpen,
    closeAddReminder,
  } = useUIStore();

  function handleClose() {
    closeAddReminder();
    clearEditing();
  }

  return (
    <Dialog
      open={addReminderOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-xl bg-[#12141c] border border-white/10 text-white rounded-3xl overflow-y-auto max-h-[85vh] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white">
            {editingEvent ? "✏️ Edit Reminder" : "➕ Add Reminder"}
          </DialogTitle>
        </DialogHeader>

        <AddEventForm
          onEventSaved={() => {
            refresh();
            handleClose();
          }}
          editingEvent={editingEvent}
          clearEditing={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
