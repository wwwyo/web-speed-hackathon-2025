import { StandardSchemaV1 } from '@standard-schema/spec';
import { getEpisodeByIdResponse } from '@wsh-2025/schema/src/openapi/schema';
import { useRef } from 'react';

import { useSubscribePointer } from '@wsh-2025/client/src/features/layout/hooks/useSubscribePointer';
import { useDuration } from '@wsh-2025/client/src/pages/episode/hooks/useDuration';
import { useSeekThumbnail } from '@wsh-2025/client/src/pages/episode/hooks/useSeekThumbnail';

const SEEK_THUMBNAIL_WIDTH = 160;

interface Props {
  episode: StandardSchemaV1.InferOutput<typeof getEpisodeByIdResponse>;
}

export const SeekThumbnail = ({ episode }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const seekThumbnail = useSeekThumbnail({ episode });
  const pointer = useSubscribePointer();
  const duration = useDuration();

  const elementRect = ref.current?.parentElement?.getBoundingClientRect() ?? { left: 0, width: 0 };
  const relativeX = pointer.x - elementRect.left;

  const percentage = Math.max(0, Math.min(relativeX / elementRect.width, 1));
  const pointedTime = duration * percentage;

  // サムネイルが画面からはみ出ないようにサムネイル中央を基準として left を計算する
  const MIN_LEFT = SEEK_THUMBNAIL_WIDTH / 2;
  const MAX_LEFT = elementRect.width - SEEK_THUMBNAIL_WIDTH / 2;

  return (
    <div
      ref={ref}
      className="absolute bottom-0 h-[90px] w-[160px] translate-x-[-50%] bg-[size:auto_100%]"
      style={{
        backgroundImage: `url(${seekThumbnail})`,
        backgroundPositionX: -1 * SEEK_THUMBNAIL_WIDTH * Math.floor(pointedTime),
        left: Math.max(MIN_LEFT, Math.min(relativeX, MAX_LEFT)),
      }}
    />
  );
};
