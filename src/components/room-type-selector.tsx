"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROOM_TYPES } from "@/types/database";

interface RoomTypeSelectorProps {
  selectedRoomType: string;
  onRoomTypeChange: (roomType: string) => void;
  disabled?: boolean;
}

export function RoomTypeSelector({
  selectedRoomType,
  onRoomTypeChange,
  disabled = false,
}: RoomTypeSelectorProps) {
  const selectedRoom = ROOM_TYPES.find((r) => r.id === selectedRoomType);

  return (
    <div className="space-y-3">
      <label className="text-[14px] font-medium text-neutral-900">
        Tipo de estancia
      </label>
      <Select
        value={selectedRoomType}
        onValueChange={onRoomTypeChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full h-11">
          <SelectValue placeholder="Selecciona el tipo de estancia" />
        </SelectTrigger>
        <SelectContent>
          {ROOM_TYPES.map((room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedRoom && (
        <p className="text-[13px] text-neutral-500">{selectedRoom.description}</p>
      )}
    </div>
  );
}
