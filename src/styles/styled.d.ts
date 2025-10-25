import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryHover: string;
      secondary: string;
      success: string;
      danger: string;
      warning: string;
      
      background: string;
      backgroundGray: string;
      
      text: string;
      textLight: string;
      textLighter: string;
      
      border: string;
      borderDark: string;
      
      notice: string;
      qna: string;
      free: string;
    };
    
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
    
    borderRadius: {
      small: string;
      medium: string;
      large: string;
    };
  }
}

