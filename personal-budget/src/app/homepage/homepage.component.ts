import { Component, inject } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import * as d3 from 'd3';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [ArticleComponent, HttpClientModule, BreadcrumbsComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  Chart2Observable = new Observable();
  dataservice: DataService = inject(DataService);
  private svg: any;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;
  //private data1 = [{Framework: '', Stars: ''},{Framework: 'Eat out', Stars: 25},
  //{Framework: 'Rent', Stars: 275},{Framework: 'Grocery', Stars: 110},{Framework: 'Insurance', Stars: 50},
  //{Framework: 'Phone Bill', Stars: 75},{Framework: 'Savings', Stars: 250},{Framework: 'Internet', Stars: 45}]
  private data: any;
  //private dataSource = this.dataservice.getAllData();
  constructor(){

  }
  ngOnInit(): void{
    this.dataservice.Chart1Observable!.subscribe((val) => {
      this.createChart(val);
    })
    this.dataservice.Chart2Observable!.subscribe((val) => {
      this.createSvg();
      this.createColors(val);
      this.createChart2(val);
    })
      //this.createChart();
      //this.createSvg();
      //this.createColors();
      //this.createChart2();
  }

  createChart(val: any) {
    var canvas = <HTMLCanvasElement> document.getElementById('myChart')!;
    var ctx = canvas.getContext('2d')!;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: val
    });
  }
  createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );
  }
  createColors(val: any): void {
    this.colors = d3.scaleOrdinal()
    .domain(val.map((d: any) => d.Stars.toString()))
    .range(['#ffcd56','#ff6384','#36a2eb','#fd6b19','#abc4ff','#b8e0d2','#e8dff5']);
  }
  createChart2(val: any): void {
    // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.Stars));
    //console.log(this.data);
  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(val))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(this.radius)
  )
  .attr('fill', (d: any, i: any) => (this.colors(i)))
  .attr("stroke", "#121926")
  .style("stroke-width", "1px");

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(val))
  .enter()
  .append('text')
  .text((d: any)=> d.val.Framework)
  .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
  }
}
