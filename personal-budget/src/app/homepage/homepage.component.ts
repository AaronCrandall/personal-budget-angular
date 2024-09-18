import { Component, inject } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import * as d3 from 'd3';
import { DataService } from '../data.service';


@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [ArticleComponent, HttpClientModule, BreadcrumbsComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  dataservice: DataService = inject(DataService);
  private svg: any;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;
  private data1 = [{Framework: '', Stars: ''},{Framework: 'Eat out', Stars: 25},
  {Framework: 'Rent', Stars: 275},{Framework: 'Grocery', Stars: 110},{Framework: 'Insurance', Stars: 50},
  {Framework: 'Phone Bill', Stars: 75},{Framework: 'Savings', Stars: 250},{Framework: 'Internet', Stars: 45}]
  //private data = this.dataservice.getD3jsData();
  public dataSource: any = {
    datasets: [
        {
            data: [25, 275, 110, 50, 75, 250, 45],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
                '#abc4ff',
                '#b8e0d2',
                '#e8dff5',
            ]
        }
    ],
    labels: ["Eat out","Rent","Grocery","Insurance","Phone Bill","Savings","Internet"]
  };
  //private dataSource = this.dataservice.getAllData();
  constructor(){

  }
  ngOnInit(): void{
      console.log(this.dataSource);
      this.createChart();
      this.createSvg();
      this.createColors();
      this.createChart2();
  }

  createChart() {
    var canvas = <HTMLCanvasElement> document.getElementById('myChart')!;
    var NewData = this.dataservice.getAllData();
    console.log(NewData);
    var ctx = canvas.getContext('2d')!;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
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
  createColors(): void {
    this.colors = d3.scaleOrdinal()
    .domain(this.data1.map((d: any) => d.Stars.toString()))
    .range(['#ffcd56','#ff6384','#36a2eb','#fd6b19','#abc4ff','#b8e0d2','#e8dff5']);
  }
  createChart2(): void {
    // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.Stars));
    //console.log(this.data);
  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(this.data1))
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
  .data(pie(this.data1))
  .enter()
  .append('text')
  .text((d: any)=> d.data1.Framework)
  .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
  }
}
