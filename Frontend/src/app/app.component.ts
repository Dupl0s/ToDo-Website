import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css"
})
export class AppComponent {

  title = "ToDo Website";
  urlName: string | null = '';

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    // Auf jede Navigation hören
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;
        const segments = currentUrl.split('/');
        const secondSegement = segments[1];
        switch (secondSegement) {
          case 'todos':
            this.urlName = 'To-Do`s';
            break;
          case 'dustbin':
          this.urlName = 'Dustbin';
          break;
          case 'calendar':
            this.urlName = 'Calendar';
            break;
          case 'categories':
            this.urlName = 'Categories';
            break;
          default:
            this.urlName = 'Home';
            break;
        }
      });
  }
}
