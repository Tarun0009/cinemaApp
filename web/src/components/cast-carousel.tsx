import Image from 'next/image';
import tmdb from '@/lib/tmdb';
import type { CastMember } from '@/types/movie';

export default function CastCarousel({ cast }: { cast: CastMember[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
      {cast.slice(0, 15).map((member) => (
        <div key={member.id} className="shrink-0 w-[100px] text-center">
          <div className="w-[80px] h-[80px] mx-auto rounded-full overflow-hidden bg-[#1F1F1F]">
            {member.profile_path ? (
              <Image
                src={tmdb.getImageUrl(member.profile_path, 'small')}
                alt={member.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#808080] text-xl font-bold">
                {member.name[0]}
              </div>
            )}
          </div>
          <p className="text-white text-xs font-medium mt-2 line-clamp-1">{member.name}</p>
          <p className="text-[#808080] text-[10px] line-clamp-1">{member.character}</p>
        </div>
      ))}
    </div>
  );
}
