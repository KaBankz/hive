import type { WeatherSummary } from '@/types/dailyReport';

type WeatherSectionProps = {
  weather: {
    summary: WeatherSummary[];
  };
};

export function WeatherSection({ weather }: WeatherSectionProps) {
  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
      <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
        <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
          Weather
        </h2>
      </div>
      <div className='grid grid-cols-3 divide-x divide-gray-200'>
        {weather.summary.map((forecast) => (
          <div
            key={forecast.forecastTimeTzFormatted}
            className='p-4 text-center'>
            <div className='text-xs font-medium text-gray-600'>
              {forecast.forecastTimeTzFormatted}
            </div>
            <div className='mt-2 text-lg font-semibold text-blue-500'>
              <i className={forecast.iconForecast}></i> {forecast.tempF}°
            </div>
            <div className='mt-2 text-[10px] text-gray-500'>
              <span className='font-medium text-gray-700'>Wind:</span>{' '}
              {forecast.wind} &nbsp;
              <span className='font-medium text-gray-700'>Precip:</span>{' '}
              {forecast.precip} &nbsp;
              <span className='font-medium text-gray-700'>Humidity:</span>{' '}
              {forecast.humidity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
