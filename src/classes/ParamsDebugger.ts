import GUI from 'lil-gui'

/**
 * ParamsDebugger class for debugging CSS custom properties.
 */
export class ParamsDebugger {
  static show: boolean
  static gui: GUI
  /**
   * Placeholder for the state, to be populated in initialize.
   */
  static state: any = {}

  /**
   * Fetch a CSS variable from the document root and return its value.
   * @param variableName Name of the CSS variable to fetch.
   * @returns The value of the fetched CSS variable.
   */
  static fetchVariable(variableName: string): string {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim()
        .replace(/['"]+/g, '') || ''
    )
  }

  /**
   * Update a CSS variable on the document root.
   * @param variableName Name of the CSS variable to update.
   * @param value New value for the CSS variable.
   */
  static updateVariable(variableName: string, value: string) {
    ParamsDebugger.state.colorText = value
    document.documentElement.style.setProperty(variableName, value)
  }

  /**
   * Update the visibility of the ParamsDebugger based on window width.
   */
  static updateVisibilityBasedOnWindowWidth() {
    const windowWidth = window.innerWidth
    if (!ParamsDebugger.show || windowWidth < 1024) {
      // Hide the ParamsDebugger
      if (ParamsDebugger.gui) {
        ParamsDebugger.gui.hide()
      }
    } else {
      // Show the ParamsDebugger
      if (ParamsDebugger.gui) {
        ParamsDebugger.gui.show()
      }
    }
  }

  /**
   * Initialize the ParamsDebugger.
   * @param show Whether to show the debugger GUI or not.
   */
  static initialize({ show }: { show: boolean }) {
    // Populate the initial state here
    ParamsDebugger.state = {
      colorText: ParamsDebugger.fetchVariable('--color-text'),
      colorBackground: ParamsDebugger.fetchVariable('--color-background'),
      colorDebug: ParamsDebugger.fetchVariable('--color-debug'),
      // Remove the pixels from the maxWidth and store it as a number
      maxWidth: ParamsDebugger.fetchVariable('--max-width').replace
        ? parseInt(
            ParamsDebugger.fetchVariable('--max-width').replace('px', '')
          )
        : 0,
      fontFamilyPrimary: ParamsDebugger.fetchVariable('--font-family-primary'),
      fontFamilySecondary: ParamsDebugger.fetchVariable(
        '--font-family-secondary'
      ),
      // Remove the string from the generalLineHeight and store it as a number
      generalLineHeight: parseFloat(
        ParamsDebugger.fetchVariable('--general-line-height')
      ),
      darkMode: false,
    }

    ParamsDebugger.updateVisibilityBasedOnWindowWidth()

    // Add event listener for window resize
    window.addEventListener('resize', () => {
      ParamsDebugger.updateVisibilityBasedOnWindowWidth()
    })

    const windowWidth = window.innerWidth
    ParamsDebugger.show = show

    if (!ParamsDebugger.show || windowWidth < 1024) return

    ParamsDebugger.gui = new GUI()

    const guiElement = document.querySelector('.dg.ac') as HTMLElement
    if (guiElement) guiElement.style.zIndex = '1000000000000'

    this.addVariablesFolder()
  }

  /**
   * Add a folder in the GUI for controlling CSS variables.
   */
  static addVariablesFolder() {
    const variableFolder = ParamsDebugger.gui.addFolder('Root Variables')

    // For --color-text
    variableFolder
      .addColor(ParamsDebugger.state, 'colorText')
      .name('Color_Text')
      .onChange((value: string) => {
        ParamsDebugger.updateVariable('--color-text', value)
      })

    // For --color-background
    variableFolder
      .addColor(ParamsDebugger.state, 'colorBackground')
      .name('Color_Background')
      .onChange((value: string) => {
        ParamsDebugger.updateVariable('--color-background', value)
      })

    // For --color-debug
    variableFolder
      .addColor(ParamsDebugger.state, 'colorDebug')
      .name('Debug_Color')
      .onChange((value: string) => {
        ParamsDebugger.updateVariable('--color-debug', value)
      })

    // For --max-width
    variableFolder
      .add(ParamsDebugger.state, 'maxWidth', 1000, 3000)
      .name('Max_Width (px)')
      .onChange((value: string) => {
        ParamsDebugger.updateVariable('--max-width', value + 'px')
      })

    // For --general-line-height
    variableFolder
      .add(ParamsDebugger.state, 'generalLineHeight', 1, 2)
      .name('General_Line_Height')
      .onChange((value: string) => {
        ParamsDebugger.updateVariable('--general-line-height', value)
      })

    // For --font-family-primary
    variableFolder
      .add(ParamsDebugger.state, 'fontFamilyPrimary', [
        'Arial',
        'Verdana',
        'Georgia',
        'Courier New',
        'Impact',
      ])
      .name('Font_Family_Primary')
      .onChange((value: string) => {
        ParamsDebugger.updateVariable('--font-family-primary', value)
      })

    // For --font-family-secondary
    variableFolder
      .add(ParamsDebugger.state, 'fontFamilySecondary', [
        'Times New Roman',
        'Tahoma',
        'Lucida Console',
        'Impact',
      ])
      .name('Font_Family_Secondary')
      .onChange((value: string) => {
        ParamsDebugger.updateVariable('--font-family-secondary', value)
      })

    // For --dark-mode (Example boolean variable)
    variableFolder
      .add(ParamsDebugger.state, 'darkMode')
      .name('Dark Mode')
      .onChange((value: boolean) => {
        // Do something with the new boolean value
        // For example, you could use it to toggle a CSS class
        if (value) {
          document.body.classList.add('dark-mode')
        } else {
          document.body.classList.remove('dark-mode')
        }
      })
  }
}
