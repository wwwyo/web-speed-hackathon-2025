import { StandardSchemaV1 } from '@standard-schema/spec';
import { getTimetableResponse } from '@wsh-2025/schema/src/openapi/schema';
import { ReactElement, useEffect, useRef, useState } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { ArrayValues } from 'type-fest';

import { ProgramDetailDialog } from '@wsh-2025/client/src/pages/timetable/components/ProgramDetailDialog';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';
import { useCurrentUnixtimeMs } from '@wsh-2025/client/src/pages/timetable/hooks/useCurrentUnixtimeMs';
import { useSelectedProgramId } from '@wsh-2025/client/src/pages/timetable/hooks/useSelectedProgramId';

interface Props {
  height: number;
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof getTimetableResponse>>;
}

export const Program = ({ height, program }: Props): ReactElement => {
  const width = useColumnWidth(program.channelId);

  const [selectedProgramId, setProgram] = useSelectedProgramId();
  const shouldProgramDetailDialogOpen = program.id === selectedProgramId;
  const onClick = () => {
    setProgram(program);
  };

  const currentUnixtimeMs = useCurrentUnixtimeMs();
  const isBroadcasting =
    new Date(program.startAt).getTime() <= currentUnixtimeMs && currentUnixtimeMs < new Date(program.endAt).getTime();
  const isArchived = new Date(program.endAt).getTime() <= currentUnixtimeMs;

  const titleRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [shouldImageBeVisible, setShouldImageBeVisible] = useState<boolean>(false);
  useEffect(() => {
    // マウント時に一度だけチェック
    const imageHeight = imageRef.current?.clientHeight ?? 0;
    const titleHeight = titleRef.current?.clientHeight ?? 0;
    setShouldImageBeVisible(imageHeight <= height - titleHeight);
  }, []);

  return (
    <>
        <button
          className={`w-auto border-[1px] border-solid border-[#000000] px-[12px] py-[8px] text-left cursor-pointer ${isArchived ? 'hover:brightness-200' : 'hover:brightness-125'}`}
          style={{
            backgroundColor: isBroadcasting ? '#FCF6E5' : '#212121',
            height: `${height}px`,
            opacity: isArchived ? 0.5 : 1,
            width,
          }}
          type="button"
          onClick={onClick}
        >
          <div className="flex size-full flex-col overflow-hidden">
            <div ref={titleRef} className="mb-[8px] flex flex-row items-start justify-start">
              <span
                className="mr-[8px] shrink-0 grow-0 text-[14px] font-bold"
                style={{ color: isBroadcasting ? '#767676' : '#999999' }}
              >
                {new Date(program.startAt).getMinutes().toString().padStart(2, '0')}
              </span>
              <div
                className="grow-1 shrink-1 overflow-hidden text-[14px] font-bold"
                style={{ color: isBroadcasting ? '#212121' : '#ffffff' }}
              >
                <Ellipsis ellipsis reflowOnResize maxLine={3} text={program.title} visibleLine={3} />
              </div>
            </div>
            <div className="w-full" style={{ opacity: shouldImageBeVisible ? 1 : 0 }}>
              <img
                ref={imageRef}
                alt=""
                className="pointer-events-none w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
                loading="lazy"
                src={program.thumbnailUrl}
              />
            </div>
          </div>
        </button>
      <ProgramDetailDialog isOpen={shouldProgramDetailDialogOpen} program={program} />
    </>
  );
};
