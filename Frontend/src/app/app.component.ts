import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css"
})
export class AppComponent {
  title = "TINF24B5";
}
