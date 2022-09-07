/**
 * Component Modules/Components
 */
import { Component, Input, OnInit } from "@angular/core";
/**
 * Component Decorator
 */
@Component({
	selector: "app-google-map",
	templateUrl: "./google-map.component.html",
	styleUrls: ["./google-map.component.css"],
})
/**
 * Component Class
 */
export class GoogleMapComponent implements OnInit {
	/**
	 * Component Properties
	 */
	@Input() lat: number;
	@Input() lng: number;
	@Input() name: string;
	id: string = `id-${Math.random().toString(16).slice(2)}`;
	/**
	 * Component Constructor
	 */
	constructor() {}
	/**
	 * Component On Init
	 */
	ngOnInit(): void {}
	/**
	 * Component On View Init
	 */
	ngAfterViewInit(): void {
		this.initMap();
	}
	/**
	 * Init map
	 */
	initMap(): void {
		let map: google.maps.Map;
		let marker: google.maps.Marker;
		let infoWindow = new google.maps.InfoWindow({
			content: this.name,
		});
		map = new google.maps.Map(document.getElementById(this.id) as HTMLElement, {
			center: { lat: this.lat, lng: this.lng },
			zoom: 8,
		});
		marker = new google.maps.Marker({
			position: { lat: this.lat, lng: this.lng },
			map,
			title: this.name,
		});
		marker.addListener("click", () => {
			infoWindow.open(map, marker);
		});
	}
}
