import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsGithub, BsInstagram, BsLinkedin } from 'react-icons/bs'

export default function FooterComponent() {
  return (
  <Footer
  container
  className='border border-t-8 border-teal-500'
  >
    <div className='w-full max-w-7xl mx-auto' >
    <div className='grid w-full justify-between sm:flex md:grid-cols-1' >
        <div className='mt-5' >
        <Link
        to='/'
        className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
          Pal's
        </span>
        Blog
      </Link>
        </div>
        <div className='grid grid-cols-2 gap-8 mt-4 sm:mt-4 sm:grid-cols-3 sm:gap-6' >
            <div>
            <Footer.Title title='About' />
<Footer.LinkGroup col >
<Footer.Link
  href='https://github.com/palbijewar/Blogging-App-By-Pal'
  target='_blank'
  rel='noopener noreferrer'
>
    All topics blogs
</Footer.Link>
<Footer.Link
  href='/about'
  target='_blank'
  rel='noopener noreferrer'
>
    Pal's blogs
</Footer.Link>
</Footer.LinkGroup>
            </div>
            <div>
            <Footer.Title title='Follow us' />
<Footer.LinkGroup col>
<Footer.Link
  href='https://github.com/palbijewar'
  target='_blank'
  rel='noopener noreferrer'
>
    GitHub
</Footer.Link>
<Footer.Link
  href='https://www.linkedin.com/in/pal-bijewar-312b3b240/'
  target='_blank'
  rel='noopener noreferrer'
>
    LinkedIn
</Footer.Link>
</Footer.LinkGroup>
            </div>
            <div>
            <Footer.Title title='Legal' />
<Footer.LinkGroup col>
<Footer.Link
  href='#'
  target='_blank'
  rel='noopener noreferrer'
>
    Privacy Policy
</Footer.Link>
<Footer.Link
  href='#'
  target='_blank'
  rel='noopener noreferrer'
>
    Terms & Conditions
</Footer.Link>
</Footer.LinkGroup>
            </div>
        </div>
        </div>
        <Footer.Divider/>
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright href='#' by="Pal Bijewar" year={new Date().getFullYear()} />
          <div className='flex gap-6 sm:justify-center sm:mt-4'>
            <Footer.Icon href='https://www.linkedin.com/in/pal-bijewar-312b3b240/' icon={BsLinkedin} />
            <Footer.Icon href='https://www.instagram.com/palbijewar/' icon={BsInstagram} />
            <Footer.Icon href='https://github.com/palbijewar' icon={BsGithub} />
            <Footer.Icon href='https://www.facebook.com/pal.bijewar.79/' icon={BsFacebook} />
          </div>
        </div>
      </div>
    </Footer>

  )
}
