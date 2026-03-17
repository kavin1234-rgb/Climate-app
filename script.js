const apiKey="7cd392c7a6564c5581d160953261603"; // Replace with your WeatherAPI key
let chart;

function getWeather(){
let district=document.getElementById("districtSelect").value;

fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${district},Tamil Nadu&days=7`)
.then(res=>res.json())
.then(data=>{
let temp=data.current.temp_c;
let rain=data.forecast.forecastday[0].day.totalprecip_mm;
let humidity=data.current.humidity;

document.getElementById("temp").innerHTML=temp+"°C";
document.getElementById("condition").innerHTML=data.current.condition.text;
document.getElementById("location").innerHTML=data.location.name;
document.getElementById("rain").innerHTML=rain;
document.getElementById("humidity").innerHTML=humidity;

showHourly(data);
showDaily(data);
showChart(data);
predictRisk(temp,rain,humidity);
});
}

function showHourly(data){
let container=document.getElementById("hourly");
container.innerHTML="";
data.forecast.forecastday[0].hour.forEach(h=>{
let card=document.createElement("div");
card.className="hourCard";
card.innerHTML=`
<p>${h.time.split(" ")[1]}</p>
<img src="${h.condition.icon}">
<p>${h.temp_c}°</p>
`;
container.appendChild(card);
});
}

function showDaily(data){
let container=document.getElementById("daily");
container.innerHTML="";
data.forecast.forecastday.forEach(day=>{
let row=document.createElement("div");
row.className="dayRow";
row.innerHTML=`
<p>${day.date}</p>
<p>${day.day.condition.text}</p>
<p>${day.day.maxtemp_c}° | ${day.day.mintemp_c}°</p>
`;
container.appendChild(row);
});
}

function showChart(data){
let labels=[];
let temps=[];
data.forecast.forecastday[0].hour.forEach(h=>{
labels.push(h.time.split(" ")[1]);
temps.push(h.temp_c);
});
let ctx=document.getElementById("tempChart");
if(chart) chart.destroy();
chart=new Chart(ctx,{
type:"line",
data:{
labels:labels,
datasets:[{
label:"Temperature °C",
data:temps,
borderColor:"red",
fill:false
}]
}
});
}

function predictRisk(temp,rain,humidity){
let result="";
let safety=[];

if(temp>38 && rain<1){
result="🔥 High Drought Risk";
safety=[
"Conserve water",
"Store drinking water",
"Avoid farming during extreme heat",
"Use drought resistant crops"
];
}
else if(rain>20 && rain<=50){
result="🌧 Heavy Rainfall Warning";
safety=[
"Carry rain protection",
"Avoid flooded streets",
"Drive slowly",
"Check weather alerts"
];
}
else if(rain>50){
result="🌊 Flood Risk";
safety=[
"Move to higher ground",
"Avoid rivers and lakes",
"Prepare emergency kit",
"Follow government warnings"
];
}
else{
result="✅ Normal Weather";
safety=[
"Stay hydrated",
"Check weather updates regularly"
];
}

document.getElementById("predictionResult").innerHTML=result;
let list=document.getElementById("safetyList");
list.innerHTML="";
safety.forEach(item=>{
let li=document.createElement("li");
li.innerText=item;
list.appendChild(li);
});
}

getWeather();
