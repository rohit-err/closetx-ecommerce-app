import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className="flex flex-col md:flex-row gap-16 my-10">
        <img
          src={assets.about_img}
          alt=""
          className="w-full md:max-w-[450px] "
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            ClosetX was born from a passion for sustainable fashion and the idea
            that style should not come at the cost of our planet. We provide a
            community-driven marketplace where people can buy and sell
            pre-loved clothes with ease.
          </p>
          <p>
            From trendy fits to timeless classics, every listing on ClosetX is
            verified and community-powered. Our platform makes it simple for
            anyone to declutter their closet, earn from their style, and help
            reduce fashion waste — all at once.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            At ClosetX, our mission is to redefine shopping by making
            second-hand the first choice. We empower people to express
            themselves, extend the life of clothing, and contribute to a
            circular fashion movement.
          </p>
        </div>
      </div>
      <div className="py-4 text-4xl">
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className="flex flex-col md:flex-row mb-20 text-sm ">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Verified Listings</b>
          <p className="text-gray-600">
            Every product is checked by our community to ensure authenticity and
            quality before reaching you.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Sustainable Choice</b>
          <p className="text-gray-600">
            Choosing ClosetX means reducing waste and giving clothes a second
            life — fashion that&apos;s better for the planet.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Community First</b>
          <p className="text-gray-600">
            ClosetX is powered by people like you. Buy, sell, and connect with a
            trusted community of fashion lovers.
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About
