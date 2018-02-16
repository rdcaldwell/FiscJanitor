import { Component, OnInit, Input } from '@angular/core';
import { InstancesService } from '../services/instances.service';
import { AnalyticsService } from '../services/analytics.service';
import { ContextService } from '../services/context.service';
import * as d3 from "d3";
import * as moment from 'moment';
import $ from 'jquery';

@Component({
  selector: 'instances',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.css'],
  providers: [InstancesService]
})
export class InstanceComponent implements OnInit {
  ec2_data: any = [];
  rds_data: any = [];
  efs_data: any = [];
  context: any = [];
  analytics_data: any = [];
  createdInstance: any = [];
  activeId: string;
  resdata: any;

  constructor(private instancesService: InstancesService,
              private analyticsService: AnalyticsService,
              private contextService: ContextService) {}

  ngOnInit() {
    this.getEC2InstanceData();
    this.getRDSInstanceData();
    this.getEFSInstanceData();
    this.getContextNames();
    this.instancesService.id.subscribe(id => this.activeId = id);
    /*
    setInterval(() => { 
        this.getInstanceData(); 
    }, 2500);
    */
  }

  getEC2InstanceData() {
    this.instancesService.describe('ec2').subscribe(data => {
      this.ec2_data = data;
    });
  }

  getRDSInstanceData() {
    this.instancesService.describe('rds').subscribe(data => {
      this.rds_data = data;
    });
  }

  getEFSInstanceData() {
    this.instancesService.describe('efs').subscribe(data => {
      this.efs_data = data;
    });
  }

  createInstance(service) {
    this.instancesService.create(service).subscribe();
  }

  terminateInstance(service) {
    this.instancesService.terminate(service, this.activeId).subscribe();
  }

  activateRow(table, id) {
    $(table).on('click', '.clickable-row', function(event) {
      $(this).addClass('active').siblings().removeClass('active');
    });
    this.instancesService.setActiveId(id);
  }

  getContextNames() {
    this.contextService.contextNames('ec2').subscribe(data => {
      console.log('trying');
      this.context = data;
    });    
  }

  analyzeInstance() {
    this.analyticsService.analyze(this.activeId).subscribe(serviceData => {
      this.analytics_data = serviceData;

      var data = this.analytics_data.Datapoints;

      console.log("data:" + data);
      
      // set the dimensions of the canvas
      var margin = {top: 20, right: 20, bottom: 200, left: 40},
              width = 1080 - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

      // set the ranges
      var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

      var y = d3.scale.linear().range([height, 0]);

      // define the axis
      var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")

      var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(10);

      // add the SVG element
      var svg = d3.select("#graph").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

          data.forEach(function(d) {
              d.Timestamp = new Date(d.Timestamp);
              d.Average = +d.Average;
          });

          function sortByDateAscending(a, b) {
              return a.Timestamp - b.Timestamp;
          }

          data = data.sort(sortByDateAscending);

          data.forEach(function(d) {
              d.Timestamp = moment(d.Timestamp).format('M/D h:mm a');
          });

          // scale the range of the data
          x.domain(data.map(function(d) { return d.Timestamp; }));
          y.domain([0, d3.max(data, function(d) { return d.Average; })]);

          // add axis
          svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis)
                  .selectAll("text")
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", "-.55em")
                  .attr("transform", "rotate(-90)" );

          svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                  .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 5)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")

          // Add bar chart
          svg.selectAll("bar")
                  .data(data)
                  .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d) { return x(d.Timestamp); })
                  .attr("width", x.rangeBand())
                  .attr("y", function(d) { return y(d.Average); })
                  .attr("height", function(d) { return height - y(d.Average); });

          svg.selectAll("text.bar")
                  .data(data)
                  .enter().append("text")
                  .attr("class", "bar")
                  .attr("text-anchor", "middle")
                  .attr("x", function(d) { return x(d.Timestamp) + x.rangeBand()/2; })
                  .attr("y", function(d) { return y(d.Average) - 5; })
                  .text(function(d) { return d.Average.toFixed(2) + "%"; });
      });
  }
}
