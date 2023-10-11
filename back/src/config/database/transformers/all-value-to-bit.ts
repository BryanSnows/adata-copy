import { ValueTransformer } from "typeorm";

export class AllValueToBitTransformer implements ValueTransformer {
    public from(value?: number | null): number | undefined {
      return Number(value);
    }
  
    public to(value?: number | null): null | number {
      if (value === null || value === undefined) {
        return null;
      }
      else {
        return value ? 1 : 0;
      }
    }
}