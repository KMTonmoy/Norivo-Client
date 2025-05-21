'use client'
import { useEffect, useState } from 'react'

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState([])

  useEffect(() => {
    fetch('./banner.json')
      .then(response => response.json())
      .then(data => setSlides(data))
      .catch(error => console.error('Error fetching banner data:', error))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [slides])

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  if (slides.length === 0) return <div>Loading...</div>

  return (
    <div className='relative rounded-lg my-6 sm:my-10 w-full max-w-7xl mx-auto h-[300px] sm:h-[600px] overflow-hidden'>
      <div
        className='w-full h-full flex transition-transform duration-500'
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map(slide => (
          <div key={slide._id} className='w-full h-full flex-shrink-0 relative'>
            <img
              src={slide.url}
              alt={slide.text}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 flex items-center bg-[#0000005b] bg-opacity-50'>
              <div className='w-full px-4 sm:px-12 text-white space-y-2 sm:space-y-4 text-center sm:text-left'>
                <h2 className='text-lg sm:text-2xl md:text-4xl font-bold'>{slide.heading}</h2>
                <p className='text-sm sm:text-base md:text-lg'>{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 sm:bottom-4 right-4 sm:right-6 flex space-x-2 sm:space-x-4">
        <button
          onClick={handlePrev}
          className='bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none z-10'
        >
          &#8592;
        </button>
        <button
          onClick={handleNext}
          className='bg-black text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none z-10'
        >
          &#8594;
        </button>
      </div>
    </div>
  )
}

export default Banner