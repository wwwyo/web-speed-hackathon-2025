import { Range, Root, Thumb, Track } from '@radix-ui/react-slider';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getEpisodeByIdResponse } from '@wsh-2025/schema/src/openapi/schema';
import invariant from 'tiny-invariant';

// Helper function to format seconds into mm:ss format
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

import { SeekThumbnail } from '@wsh-2025/client/src/pages/episode/components/SeekThumbnail';
import { useCurrentTime } from '@wsh-2025/client/src/pages/episode/hooks/useCurrentTime';
import { useDuration } from '@wsh-2025/client/src/pages/episode/hooks/useDuration';
import { useMuted } from '@wsh-2025/client/src/pages/episode/hooks/useMuted';
import { usePlaying } from '@wsh-2025/client/src/pages/episode/hooks/usePlaying';

interface Props {
  episode: StandardSchemaV1.InferOutput<typeof getEpisodeByIdResponse>;
}

export const PlayerController = ({ episode }: Props) => {
  const duration = useDuration();
  const [currentTime, updateCurrentTime] = useCurrentTime();
  const [playing, togglePlaying] = usePlaying();
  const [muted, toggleMuted] = useMuted();

  return (
    <div className="relative h-[120px]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#212121] to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-[12px]">
        <div className="group relative size-full">
          <div className="pointer-events-none relative size-full opacity-0 group-hover:opacity-100">
            <SeekThumbnail episode={episode} />
          </div>

          <Root
            className="group relative flex h-[20px] w-full cursor-pointer touch-none select-none flex-row items-center"
            max={duration}
            min={0}
            orientation="horizontal"
            value={[currentTime]}
            onValueChange={([t]) => {
              invariant(t);
              updateCurrentTime(t);
            }}
          >
            <Track className="grow-1 relative h-[2px] rounded-[4px] bg-[#999999] group-hover:h-[4px]">
              <Range className="absolute h-[2px] rounded-[4px] bg-[#1c43d1] group-hover:h-[4px]" />
            </Track>
            <Thumb className="block size-[20px] rounded-[10px] bg-[#1c43d1] opacity-0 focus:outline-none group-hover:opacity-100" />
          </Root>
        </div>

        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <div className="flex flex-row items-center">
                <button
                  aria-label={playing ? '一時停止する' : '再生する'}
                  className="block rounded-[4px] bg-transparent hover:bg-[#FFFFFF1F] cursor-pointer"
                  type="button"
                  onClick={() => {
                    togglePlaying();
                  }}
                >
                  <span
                    className={`i-material-symbols:${playing ? 'pause-rounded' : 'play-arrow-rounded'} m-[14px] block size-[20px] shrink-0 grow-0 text-[#FFFFFF]`}
                  />
                </button>

              <span className="ml-[4px] block shrink-0 grow-0 text-[12px] font-bold text-[#FFFFFF]">
                {formatTime(currentTime)}
                {' / '}
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex flex-row items-center">
              <button
                aria-label={muted ? 'ミュート解除する' : 'ミュートする'}
                className="block rounded-[4px] bg-transparent hover:bg-[#FFFFFF1F] cursor-pointer"
                type="button"
              >
                <span
                  className={`i-material-symbols:${muted ? 'volume-off-rounded' : 'volume-up-rounded'} m-[14px] block size-[20px] shrink-0 grow-0 text-[#FFFFFF]`}
                  onClick={() => {
                    toggleMuted();
                  }}
                />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
