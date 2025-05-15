# MUI Icons (@mui/icons-material)

Material UI provides a comprehensive set of icons through the `@mui/icons-material` package. This package includes over 2,100 official Material Icons converted to SvgIcon components. <mcreference link="https://mui.com/material-ui/material-icons/" index="0">0</mcreference>

## Installation

To use these icons, you need to install the `@mui/icons-material` package. It has a peer dependency on `@mui/material`. <mcreference link="https://mui.com/material-ui/material-icons/" index="0">0</mcreference>

"""bash
npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
# or
yarn add @mui/icons-material @mui/material @emotion/styled @emotion/react
"""

## Import Statement

Each icon is a separate component and can be imported directly from `@mui/icons-material`.

"""javascript
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import LightModeIcon from '@mui/icons-material/LightMode';
// or for specific icons listed in the project plan:
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ErrorIcon from '@mui/icons-material/Error';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import LanguageIcon from '@mui/icons-material/Language';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
"""

## Finding Icons

You can browse and search for all available Material Icons on the official MUI documentation website:
*   [Material Icons Search](https://mui.com/material-ui/material-icons/) <mcreference link="https://mui.com/material-ui/material-icons/" index="0">0</mcreference>

The search field supports synonyms (e.g., searching for "hamburger" might show the "Menu" icon). <mcreference link="https://mui.com/material-ui/material-icons/" index="0">0</mcreference>

## Basic Usage

Icons can be used like any other React component.

"""jsx
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function IconButtons() {
  return (
    <>
      <IconButton aria-label="delete">
        <DeleteIcon />
      </IconButton>
      <IconButton aria-label="alarm" color="primary">
        <AlarmIcon />
      </IconButton>
      <IconButton color="secondary" aria-label="add to shopping cart">
        <AddShoppingCartIcon />
      </IconButton>
    </>
  );
}
"""

## Key Props

The SvgIcon components (which all Material Icons are based on) accept several common props:

*   **`color`**: `enum('inherit', 'action', 'disabled', 'primary', 'secondary', 'error', 'info', 'success', 'warning', string)`
    *   Default: `'inherit'`
    *   Applies a theme color palette to the icon.
*   **`fontSize`**: `enum('inherit', 'large', 'medium', 'small', string)`
    *   Default: `'medium'`
    *   The fontSize applied to the icon. Presets are provided or a custom string can be used.
*   **`sx`**: `object`
    *   The `sx` prop allows for custom styling using a superset of CSS.
*   **`titleAccess`**: `string`
    *   Provides an accessible title for the icon. Useful for screen readers when the icon's purpose isn't clear from context.

## Common Patterns/Advanced Usage

### Icons in Buttons

Icons are frequently used within `Button` or `IconButton` components.

"""jsx
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

// ...
<Button variant="contained" endIcon={<SendIcon />}>
  Send
</Button>
"""

### Custom Colors and Sizes

"""jsx
import HomeIcon from '@mui/icons-material/Home';
import { pink } from '@mui/material/colors';

// ...
<HomeIcon color="primary" />
<HomeIcon color="secondary" fontSize="large" />
<HomeIcon sx={{ color: pink[500], fontSize: 40 }} />
"""

## Accessibility (A11y)

*   **Decorative Icons:** If an icon is purely decorative or its meaning is conveyed by adjacent text (e.g., a "Print" button with a printer icon), it should be hidden from assistive technologies using `aria-hidden="true"`. MUI icons usually handle this by not adding `role="img"` or `aria-label` by default if they are deemed decorative.
*   **Semantic Icons:** If an icon conveys meaning on its own (e.g., an `IconButton` with only an icon), provide an accessible label.
    *   For `IconButton`, use the `aria-label` prop on the `IconButton` itself.
    *   For standalone `SvgIcon` components, use the `titleAccess` prop or wrap it with an element providing an accessible name.

"""jsx
// Good for IconButton
<IconButton aria-label="settings">
  <SettingsIcon />
</IconButton>

// Good for standalone semantic icon
<ErrorIcon titleAccess="Error" color="error" />
"""

## Styling/Customization

Besides `color`, `fontSize`, and the `sx` prop, you can customize icons globally through the theme.

"""js
// In your theme customization
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: { // Apply to all SvgIcons
          // color: 'green',
          // fontSize: '3rem',
        },
        colorPrimary: {
          color: 'orange', // Override primary color for icons
        },
      },
    },
  },
});
"""

## Version Specific Notes

*   The `@mui/icons-material` package is regularly updated with new icons. Ensure your package version is current to access the latest set.
*   It depends on `@mui/material` and Emotion, so ensure compatibility between these packages. <mcreference link="https://mui.com/material-ui/material-icons/" index="0">0</mcreference>

## Project-Specific Icons

The following icons are listed in the project plan (`2_document_mui.md`) and are available from `@mui/icons-material`:

*   `AutoAwesomeIcon`
*   `CheckIcon`
*   `CloseIcon`
*   `CompareArrowsIcon`
*   `ContentCopyIcon`
*   `ErrorIcon`
*   `ErrorOutlineIcon`
*   `KeyboardIcon`
*   `LanguageIcon`
*   `SwapHorizIcon`
*   `SwapVertIcon`
*   `WarningAmberIcon`

Individual documentation files for each specific icon are generally unnecessary as their usage follows the general patterns described above. Key differences would be their visual appearance and semantic meaning.