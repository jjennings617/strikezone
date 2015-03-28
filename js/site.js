
  /**
   * Created by aaron on 3/28/15.
   */
  $('div.dropdown ul.dropdown-menu li a').click(function (e) {
    soxPitcherHandler($(this).text());
  });

  $('div.dropdown.ump ul.dropdown-menu li a').click(function (e) {
    umpHandler($(this).text());
  });

function soxPitcherHandler(pitcherName) {
  console.log("rendering for pitcher="+pitcherName);
  strikeZoneRender.buildStrikeZone(pitcherName.replace(" ", ""), pitcherName, true);
}

function umpHandler(name) {
  console.log("rendering for ump="+name);
  strikeZoneRender.buildStrikeZone(name.replace(" ", ""), name, false);
}