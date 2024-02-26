import { Button } from 'flowbite-react';
import React from 'react';

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className="flex-1 justify-center flex flex-col">
        <h2 className='text-2xl'>
          Want to create your own blog?
        </h2>
        <p className='text-gray-500 my-2'>
          Checkout these resources:
        </p>
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
            <a href="https://www.bing.com/search?q=how+to+blog&cvid=3eee7fb30a414b4e8fa04bdc2fd7a5af&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQABhAMgYIAhAAGEAyBggDEAAYQDIGCAQQABhAMgYIBRAAGEAyBggGEAAYQDIGCAcQABhAMgYICBAAGEDSAQgyOTEwajBqMagCALACAA&FORM=ANAB01&PC=HCTS" target='_blank' rel='noopener noreferrer'>
            How to blog in 2024 !
            </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://static.wixstatic.com/media/c7e19c_8439807cf5d9461bb81b12cbdd381fe6~mv2.jpg/v1/fit/w_320%2Ch_821%2Cal_c%2Cq_80,enc_auto/file.jpg" />
      </div>
    </div>
  );
}
