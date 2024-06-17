import { IsString } from "amala";

export default class DrinkBeer {
  @IsString()
  liters!: string;
}
