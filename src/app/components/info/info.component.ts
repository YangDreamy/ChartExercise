import { Component, OnInit } from '@angular/core';
import { InfoServiceService } from 'src/app/services/info-service.service';
import * as Highcharts from 'highcharts';
// import { Chart } from 'angular-highcharts';
import { DatePipe } from '@angular/common'; 
import { collectExternalReferences } from '@angular/compiler';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

declare function csvToJSON():any;
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit {
  selectedDate1 : Date;
  selectedDate2 : Date;

  SDate1:String="";
  SDate2:String="";

  chartConstructor = "chart";
  chartCallback;
  updateFlag = false; // 可选 Boolean
  oneToOneFlag = true; // 可选 Boolean，默认为 false
  runOutsideAngularFlag = false; // 可选 Boolean，默认为 false
  Highcharts = Highcharts; // 必填
  // chartConstructor = 'chart'; // 可选 String，默认为 'chart'
  
  public selectedList = []; //勾选的checkbox
  public dataList = [];//save different countries data
  public CSVlist : any[];
  public result : any[];
  public dateList  = [];
  public dataTank = [];
  chartOptions = {
  //   chart: {
  //     type: 'column'
  // },
    title:{
      text: 'Price LineChart',
      floating:true,
      style:{
        color: '#3E576F',
        fontSize: '25px'
      }},
    xAxis:{
      categories : [] ,
             labels : {
                rotation: 80,
             }
    },
    series:[{
      "id": "BE",
      "data": []
    }]
  };
  chartOptionsbar = {
      chart: {
        type: 'column'
    },
      title:{
        text: 'Price BarChart',
        floating:true,
        style:{
          color: '#3E576F',
          fontSize: '25px'
        }},
      xAxis:{
        categories : [] ,
               labels : {
                  rotation: 80,
               }
      },
      series:[{
        "id": "BE",
        "data": []
      }]
    };
  public ContryList : any=[{
    title: 'Belgium',
    name:'BE',
    checked:false
  },
  {
    title:'Switzerland',
    name:'CH',
    checked:false
  },
  {
    title:'CzechRepublic',
    name:'CZ',
    checked:false

  },
  {
    title:'Germany-Austria',
    name:"DE_AT",
    checked:false
  },
  {
    title:'Denmark1',
    name:"DK1",
    checked:false
  },
  {
    title:'Denmark2',
    name:"DK2",
    checked:false
  },
  {
    title:'Spain',
    name:"ES",
    checked:false
  },
  {
    title:'France',
    name:"FR",
    checked:false
  },
  {
    title:'Netherland',
    name:"NL",
    checked:false
  }
  ];
  
  constructor( private infoServiceService : InfoServiceService 
    ,private datePipe: DatePipe) {
      const self = this;

    this.chartCallback = chart => {
      // saving chart reference
      // self.chart = chart;
    };
    }

   ngOnInit(){
    // console.log(this.chart);
       this.infoServiceService.getCSV().subscribe(data => {
            // console.log(data);
            this.CSVlist = data;
            this.result = this.csvToJSON(this.CSVlist);
        });
   }
//make csv file to Json type
    csvToJSON(csv) {
    if (csv==null) return;
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    //console.log(headers);
    for (var i = 1; i < lines.length - 1; i++) {
        var obj = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    console.log(result)
    return result;
  }

  MakeStringToDateType(date:String){//20171204 - H1  let dateString1= '10-06-2015' 

    var year : String = date.substr(1,4);
    var month : String = date.substr(5,2);
    var day: String = date.substr(7,2);
    var hour: String =  date.substring(13,date.length-1);
    var newDate : String = month.toString()+"-"+day.toString()+"-"+ year.toString() + " " + hour.toString()+":" +"00:00";
    return newDate;
  }

  //select the dursion
  showDate(){
    if(this.selectedDate1.getTime()>this.selectedDate2.getTime())
    {
      Swal.fire({  
        icon: 'error',  
        title: 'Oops...',  
        text: 'end time is before start time! please change it',  
        footer: '<a href>Why do I have this issue?</a>'  
      })
      return;
    }
    this.SDate1 = this.datePipe.transform(this.selectedDate1, "yyyy-MM-dd - H'H'");
    this.SDate2 = this.datePipe.transform(this.selectedDate2, "yyyy-MM-dd - H'H'");
  }


  //select the country
  selectCheckbox(check:boolean,value:string){    
    if(check){
      this.selectedList.push(value);
    }
    else{
      const index = this.selectedList.indexOf(value);
      this.selectedList.splice(index, 1);
    }
    console.log(this.selectedList)
  }

 //draw a Linechart
  drawLine(){
    this.dataTank = [];
    var endtime = this.SDate2;
    for(let i =0;i<this.selectedList.length;i++)
    {
      var city = this.selectedList[i];
      var data = [];
      var name = "";
      this.dateList = [];
      for(let j = 0;j<this.result.length;j++)
      {
        var newStringDate = this.MakeStringToDateType(this.result[j]['\"'+"Dates"+'\"']);
        var currentdate = new Date(newStringDate.toString())
        // console.log(currentdate);    
        if(currentdate.getTime() >= this.selectedDate1.getTime() && currentdate.getTime()<= this.selectedDate2.getTime())
        {
          this.dateList.push(this.result[j]['\"'+"Dates"+'\"']);
          var res = this.result[j]['\"'+city+'\"'];
          data.push(Number(res));
        }
        
      }

      for(let j = 0;j<this.ContryList.length;j++){
        if (this.ContryList[j].name==city){
          name=this.ContryList[j].title
        }
      }
      this.dataTank.push({"name":name,"data":data});
      const self = this;
      // chart = this.chart;
      if(this.dataList.length == 0)
      {
        Swal.fire({  
          icon: 'error',  
          title: 'Oops...',  
          text: "no data! please choose date from 2017-12-04 to 2017-12-10",  
          footer: '<a href>Why do I have this issue?</a>'  
        })
      }

      setTimeout(() => {
  
        self.chartOptions.xAxis.categories = this.dateList;
        self.chartOptions.series = this.dataTank;
  
        self.updateFlag = true;
      }, 2000);
  

    }
    console.log(this.chartOptions);
  }
//draw a bar chart
  drawBar(){
    this.dataTank = [];
    var endtime = this.SDate2;
    for(let i =0;i<this.selectedList.length;i++)
    {
      var city = this.selectedList[i];
      var data = [];
      var name = "";
      this.dateList = [];
      for(let j = 0;j<this.result.length;j++)
      {
        var newStringDate = this.MakeStringToDateType(this.result[j]['\"'+"Dates"+'\"']);
        var currentdate = new Date(newStringDate.toString())
        // console.log(currentdate);    
        if(currentdate.getTime() >= this.selectedDate1.getTime() && currentdate.getTime()<= this.selectedDate2.getTime())
        {
          this.dateList.push(this.result[j]['\"'+"Dates"+'\"']);
          var res = this.result[j]['\"'+city+'\"'];
          data.push(Number(res));
        }
        
      }

      for(let j = 0;j<this.ContryList.length;j++){
        if (this.ContryList[j].name==city){
          name=this.ContryList[j].title
        }
      }
      this.dataTank.push({"name":name,"data":data});
      const self = this;
      // chart = this.chart;
      // console.log(this.dataTank)
      console.log(this.dateList);
      if(this.dataList.length == 0)
      {
        Swal.fire({  
          icon: 'error',  
          title: 'Oops...',  
          text: "no data! please choose date from 2017-12-04 to 2017-12-10",  
          footer: '<a href>Why do I have this issue?</a>'  
        })
      }
      

      setTimeout(() => {
  
        self.chartOptionsbar.xAxis.categories = this.dateList;
        self.chartOptionsbar.series = this.dataTank;
  
        self.updateFlag = true;
      }, 2000);
  

    }
  }


}
