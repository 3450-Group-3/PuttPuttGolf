// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
	export interface DefaultTheme {
		primary: string;
		secondary: string;
		accent: string;
		textColor: string;
	}
}
