import { MovieResult, TvResult } from "moviedb-promise";
import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Media = MovieResult | TvResult | undefined
