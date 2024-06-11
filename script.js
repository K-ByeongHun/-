document.getElementById('collatzForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const number = parseInt(document.getElementById('number').value);
  const sequence = collatzSequence(number);
  drawChart(sequence);
});

document.getElementById('resetButton').addEventListener('click', function() {
  d3.select("#chartContainer").html("");
  document.getElementById('number').value = '';
});

function collatzSequence(n) {
  const sequence = [];
  let steps = 0;
  while (n !== 1) {
      sequence.push({ step: steps, value: n });
      if (n % 2 === 0) {
          n = n / 2;
      } else {
          n = 3 * n + 1;
      }
      steps += 1;
  }
  sequence.push({ step: steps, value: 1 });
  return sequence;
}

function drawChart(data) {
  const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#chartContainer").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
      .domain(data.map(d => d.step))
      .range([0, width])
      .padding(0.1);

  const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([height, 0]);

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.step))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value))
      .attr("fill", "steelblue");

  svg.selectAll(".barLabel")
      .data(data)
      .enter().append("text")
      .attr("class", "barLabel")
      .attr("x", d => x(d.step) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.value);

  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.bottom - 10)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("Steps");

  svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("x", -margin.left)
      .attr("y", margin.top - 10)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .text("Value");
}