1.2.3 / 2016-12-10
==================

  * Removed dependency on forked version of `clap-detector`
  * Switch to Genericons Neue for in-app icons.
  * A lot of code cleanup.
  * Removed default config file and moved location of custom config.
  * Production build and a proper install process with launch options.

1.2.2 / 2016-12-01
==================

  * Handle any time interval drift.
  * Add sample data and sound files.
  * Remove underline decoration from timer stopwatch after stopping.
  * Another overhaul of calorie calculations. Updated formula with a 1.0 coefficient of determination using the metronome sample data. Calculate calories and distance with every new spin of the flywheel.

1.2.1 / 2016-11-27
==================

  * Added main menu.
  * Better application of the MUI themes.
  * Store configuration options in files.
  * Emit spins on app launch, so Settings can use them too.
  * Add a function for fixing config data screwed up by JSON functions, which set everything as a string.
  * Reset RPMs when there are no recent spins so that calories and distance don't keep increasing.
  * Added a Settings screen which allows changing the theme, setting distance default, and tweaking some "listener" settings used to detect rotations of the flywheel.

1.2.0 / 2016-11-25
==================

  * Fixed debug vars.
  * Switch to forked version of clap-detector and use the new history for more accurate spin times.  
  * Adjust calorie precision.
  * Use webpack.
  * Use React for the UI. Use Material-UI for common components.
  * Improve spin time processing, taking into account long pauses and the start time.
  * Add Splash screen.
  * Instead of buttons, make the entire time area clickable to start/stop/exit. Show faded button as a visual clue. Use a AYS dialog for stop/exit.
  * Updates to README

1.1.0 / 2016-11-21
==================

  * Accurate calorie formula.
  * RPMs / Watts toggling.

1.0.0 / 2016-11-20
==================

  * Basic timer UI is working.