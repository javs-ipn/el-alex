
export class PackageDimension {
    public static SPLIT_TOKEN = 'X';
    public static WIDTH_INDEX = 1;
    public static WEIGHT_INDEX = 2;
    public static HEIGHT_INDEX = 3;
    public static LENGHT_INDEX = 0;
    public packageNumber: number;
    public dimensions: string;

    public splitDimensionsString(dimensionString: string): string[] {
        return dimensionString.split(PackageDimension.SPLIT_TOKEN);
    }
}
