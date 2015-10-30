
module Higherframe.UI {

  export class Colors {

    private static colors: Array<{}> = [
      {
        '500': '#F44336'
      },
      {
        '500': '#E91E63'
      },
      {
        '500': '#9C27B0'
      },
      {
        '500': '#673AB7'
      },
      {
        '500': '#3F51B5'
      },
      {
        '500': '#2196F3'
      },
      {
        '500': '#03A9F4'
      },
      {
        '500': '#00BCD4'
      },
      {
        '500': '#009688'
      },
      {
        '500': '#4CAF50'
      },
      {
        '500': '#8BC34A'
      },
      {
        '500': '#CDDC39'
      },
      {
        '500': '#FFEB3B'
      },
      {
        '500': '#FFC107'
      },
      {
        '500': '#FF9800'
      },
      {
        '500': '#FF5722'
      }
    ];

    static Red(): string { return Colors.colors[0]['500']; };
    static Pink(): string { return Colors.colors[1]['500']; };
    static Purple(): string { return Colors.colors[2]['500']; };
    static DeepPurple(): string { return Colors.colors[3]['500']; };
    static Indigo(): string { return Colors.colors[4]['500']; };
    static Blue(): string { return Colors.colors[5]['500']; };
    static LightBlue(): string { return Colors.colors[6]['500']; };
    static Cyan(): string { return Colors.colors[7]['500']; };
    static Teal(): string { return Colors.colors[8]['500']; };
    static Green(): string { return Colors.colors[9]['500']; };
    static LightGreen(): string { return Colors.colors[10]['500']; };
    static Lime(): string { return Colors.colors[11]['500']; };
    static Yellow(): string { return Colors.colors[12]['500']; };
    static Amber(): string { return Colors.colors[13]['500']; };
    static Orange(): string { return Colors.colors[14]['500']; };
    static DeepOrange(): string { return Colors.colors[15]['500']; };

    static Random(variant?: string): string {

      if (!variant) {

        variant = '500';
      }

      return Colors.colors[Math.floor(Math.random() * Colors.colors.length)][variant];
    }
  }
}
