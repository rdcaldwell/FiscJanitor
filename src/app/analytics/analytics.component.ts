import {Component, Inject, OnInit} from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as d3 from 'd3';
import * as moment from 'moment';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  providers: [AmazonWebService]
})
export class AnalyticsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AnalyticsComponent>,
    private amazonWebService: AmazonWebService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
   * Closes modal window.
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Create d3.js bar graph of CPU Utilizaiton on component initialization.
   */
  ngOnInit() {
    let data = this.data.response;
    // set the dimensions of the canvas
    const margin = { top: 20, right: 20, bottom: 200, left: 40 },
      width = 1080 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    // set the ranges
    const x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    const y = d3.scale.linear().range([height, 0]);

    // define the axis
    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(10);

    // add the SVG element
    const svg = d3.select('#graph').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

    data.forEach(function (d) {
      d.Timestamp = new Date(d.Timestamp);
      d.Average = +d.Average;
    });

    function sortByDateAscending(a, b) {
      return a.Timestamp - b.Timestamp;
    }

    data = data.sort(sortByDateAscending);

    data.forEach(function (d) {
      d.Timestamp = moment(d.Timestamp).format('M/D h:mm a');
    });

    // scale the range of the data
    x.domain(data.map(function (d) { return d.Timestamp; }));
    y.domain([0, d3.max(data, function (d) { return d.Average; })]);

    // add axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '-.55em')
      .attr('transform', 'rotate(-90)');

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 5)
      .attr('dy', '.71em')
      .style('text-anchor', 'end');

    // Add bar chart
    svg.selectAll('bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) { return x(d.Timestamp); })
      .attr('width', x.rangeBand())
      .attr('y', function (d) { return y(d.Average); })
      .attr('height', function (d) { return height - y(d.Average); });

    svg.selectAll('text.bar')
      .data(data)
      .enter().append('text')
      .attr('class', 'bar')
      .attr('text-anchor', 'middle')
      .attr('x', function (d) { return x(d.Timestamp) + x.rangeBand() / 2; })
      .attr('y', function (d) { return y(d.Average) - 5; })
      .text(function (d) { return d.Average.toFixed(2) + '%'; });
  }
}
