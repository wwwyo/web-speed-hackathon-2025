import { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type ChannelId = string;

export function useTimetable() {
  const channels = useStore((s) => Object.values(s.features.channel.channels));
  const programs = useStore((s) => Object.values(s.features.timetable.programs));

  const record: Record<
    ChannelId,
    {
      id: ChannelId;
      logoUrl: string;
      name: string;
      programs: ArrayValues<typeof programs>[];
    }
  > = {};

  for (const channel of channels) {
    const filteredPrograms = programs
      .filter((program) => program.channelId === channel.id)
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    record[channel.id] = {
      id: channel.id,
      logoUrl: channel.logoUrl,
      name: channel.name,
      programs: filteredPrograms,
    };
  }

  return record;
}
