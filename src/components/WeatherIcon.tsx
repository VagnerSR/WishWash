import clearDay from "@meteocons/svg/fill/clear-day.svg";
import partlyCloudyDay from "@meteocons/svg/fill/partly-cloudy-day.svg";
import overcastDay from "@meteocons/svg/fill/overcast-day.svg";
import overcastNight from "@meteocons/svg/fill/overcast-night.svg";
import fogDay from "@meteocons/svg/fill/fog-day.svg";
import drizzle from "@meteocons/svg/fill/drizzle.svg";
import rain from "@meteocons/svg/fill/rain.svg";
import overcastDayRain from "@meteocons/svg/fill/overcast-day-rain.svg";
import snow from "@meteocons/svg/fill/snow.svg";
import partlyCloudyDaySnow from "@meteocons/svg/fill/partly-cloudy-day-snow.svg";
import partlyCloudyDayRain from "@meteocons/svg/fill/partly-cloudy-day-rain.svg";
import thunderstormsDayRain from "@meteocons/svg/fill/thunderstorms-day-rain.svg";
import thermometer from "@meteocons/svg/fill/thermometer.svg";
import wind from "@meteocons/svg/fill/wind.svg";
import sunrise from "@meteocons/svg/fill/sunrise.svg";
import sunset from "@meteocons/svg/fill/sunset.svg";
import moonrise from "@meteocons/svg/fill/moonrise.svg";
import moonset from "@meteocons/svg/fill/moonset.svg";
import moonNew from "@meteocons/svg/fill/moon-new.svg";
import moonWaxingCrescent from "@meteocons/svg/fill/moon-waxing-crescent.svg";
import moonFirstQuarter from "@meteocons/svg/fill/moon-first-quarter.svg";
import moonWaxingGibbous from "@meteocons/svg/fill/moon-waxing-gibbous.svg";
import moonFull from "@meteocons/svg/fill/moon-full.svg";
import moonWaningGibbous from "@meteocons/svg/fill/moon-waning-gibbous.svg";
import moonLastQuarter from "@meteocons/svg/fill/moon-last-quarter.svg";
import moonWaningCrescent from "@meteocons/svg/fill/moon-waning-crescent.svg";
import notAvailable from "@meteocons/svg/fill/not-available.svg";
import type { WeatherIconSlug } from "../lib/weatherIconSlug";

const ICON_SRC: Record<WeatherIconSlug, string> = {
  "clear-day": clearDay,
  "partly-cloudy-day": partlyCloudyDay,
  "overcast-day": overcastDay,
  "overcast-night": overcastNight,
  "fog-day": fogDay,
  drizzle,
  rain,
  "overcast-day-rain": overcastDayRain,
  snow,
  "partly-cloudy-day-snow": partlyCloudyDaySnow,
  "partly-cloudy-day-rain": partlyCloudyDayRain,
  "thunderstorms-day-rain": thunderstormsDayRain,
  thermometer,
  wind,
  sunrise,
  sunset,
  moonrise,
  moonset,
  "moon-new": moonNew,
  "moon-waxing-crescent": moonWaxingCrescent,
  "moon-first-quarter": moonFirstQuarter,
  "moon-waxing-gibbous": moonWaxingGibbous,
  "moon-full": moonFull,
  "moon-waning-gibbous": moonWaningGibbous,
  "moon-last-quarter": moonLastQuarter,
  "moon-waning-crescent": moonWaningCrescent,
  "not-available": notAvailable,
};

interface WeatherIconProps {
  slug: WeatherIconSlug;
  size?: number;
  className?: string;
  alt?: string;
}

export function WeatherIcon({ slug, size = 24, className, alt = "" }: WeatherIconProps) {
  return (
    <img
      src={ICON_SRC[slug]}
      width={size}
      height={size}
      className={className}
      alt={alt}
      style={{ display: "inline-block", flexShrink: 0 }}
    />
  );
}

export type { WeatherIconSlug };
