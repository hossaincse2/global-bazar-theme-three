import userImg from '@/assets/images/userpng.png';
import Image from 'next/image';

const PosUser = ({user}) => {
    return (
        <div>
            <div className="flex items-center gap-[6px]">
                <div className="w-[34px] h-[34px] rounded-full overflow-hidden border border-gray-200">
                    <Image
                        src={userImg}
                        alt="user image"
                    />
                </div>
                <p className="text-base text-[#0A033C] font-medium capitalize">
                    {user.name}
                </p>
            </div>
        </div>
    );
};

export default PosUser;
