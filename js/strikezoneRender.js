/**
 * Created by aaron on 3/28/15.
 */
var strikeZoneRender = (function() {

  function buildStrikeZone(name, fullName, isPitcher) {
    var attachPoint = isPitcher ? "#pitcherAttachPoint" : "#umpireAttachPoint";
    var tooltip = d3.select(attachPoint)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("z-index", "20")
      .style("visibility", "hidden")
      .style("top", "400px")
      .style("left", "85px")
      .style("width", "300px");

    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = 600 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;


    var x = d3.scale.linear()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    var color = ["#DD5C55", "#346389", "#88BB4A"];
    var colorx = d3.scale.ordinal().range(color);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var svg = d3.select(attachPoint).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("data/" + name + ".json", function (err, data) {

      data.forEach(function (d) {
        //console.log("Description=" + d.des);
        if (d.px && (d.des == "Ball" || d.des.indexOf("Strike") > -1)) {
          d.x = +d.px;
          d.y = +d.pz;

          if (d.des.indexOf("Strike") > -1) {
            d.t = "Strike"
          }
          else if (d.des == "Ball") {
            d.t = "Ball"
          }

          if (d.pitch_type === "FF") {
            d.p = "Four Seam Fastball"
          }
          else if (d.pitch_type === "FA") {
            d.p = "Fastball"
          }
          else if (d.pitch_type === "FT") {
            d.p = "Two Seam Fastball"
          }
          else if (d.pitch_type === "CU") {
            d.p = "Curveball"
          }
          else if (d.pitch_type === "SL") {
            d.p = "Slider"
          }
          else if (d.pitch_type === "CH") {
            d.p = "Changeup"
          }
          d.s = d.start_speed;
        }
        //console.log(d.x, d.y);
      });

      x.domain(d3.extent(data, function (d) {
        if (d.px && (d.des == "Ball" || d.des.indexOf("Strike") > -1)) {
          return d.x;
        }
      })).nice();
      y.domain(d3.extent(data, function (d) {
        if (d.px && (d.des == "Ball" || d.des.indexOf("Strike") > -1)) {
          return d.y;
        }
      })).nice();

      console.log(x(-0.8));
      console.log(x(0.8));

      svg.append("g")
        .attr("class", "box")
        .append("rect")
        .attr("x", x(-0.8))
        .attr("y", y(3.5))
        .attr("width", (x(0.8) - x(-0.8)))
        .attr("height", (y(1.5) - y(3.5)))
        .style();

      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2.5))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Pitch Location for " + fullName);

      svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", function (d) {
          if (d.px && (d.des == "Ball" || d.des.indexOf("Strike") > -1)) {
            return x(d.x);
          }
        })
        .attr("cy", function (d) {
          if (d.px && (d.des == "Ball" || d.des.indexOf("Strike") > -1)) {
            return y(d.y);
          }
        })
        .style("fill", function (d) {
          if (d.px && (d.des == "Ball" || d.des.indexOf("Strike") > -1)) {
            return colorx(d.t);
          }
        })
        .on("mouseover", function (d) {
          d3.select(this)
            .transition().duration(50).attr("r", 15),
            tooltip.html("<h3>" + "Pitch: " + d.p + "<br>Speed: " + d.s + "<br>Description: " + d.des + "</h3>")
              .style("transition-property", "opacity")
              .style("transition-duration", "0.7s")
              .style("opacity", "1")
              .style("visibility", "visible");
        })
        .on("mouseout", function (d) {
          d3.select(this)
            .transition().duration(50).attr("r", 5),
            tooltip.style("visibility", "hidden");
        });

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("distance from center of plate (feet)");

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("height (feet)");

      var legend = svg.selectAll(".legend")
        .data(colorx.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          return "translate(0," + i * 20 + ")";
        });

      legend.append("rect")
        .attr("x", width - 30)
        .attr("y", margin.top)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorx);

      legend.append("text")
        .attr("x", width - 40)
        .attr("y", margin.top + 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
          console.log("text="+d);
          return d;
        });


    });

    console.log("working");

  }

  return {
    buildStrikeZone: buildStrikeZone
  }
})();