import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data = [{"Framework": "", "Stars": ""}];
  public dataSource: any = {
    datasets: [
        {
            data: [],
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
    labels: []
  };
  constructor(private http: HttpClient) {
    if(this.dataSource.datasets[0].data[0] === undefined){
      this.http.get('http://localhost:3000/budget').subscribe((res: any)=>{
        //console.log(res);
        for (var i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
        }
        for(var i = 0; i < this.dataSource.labels.length; i++){
          var datas = {"Framework": this.dataSource.labels[i], "Stars":this.dataSource.datasets[0].data[i]}
          this.data.push(datas);
        }
      });
    }
  }
  public getAllData(){
    console.log(this.dataSource);
    return this.dataSource;
  }
  public getD3jsData(){
    console.log(this.data);
    return this.data;
  }
}
