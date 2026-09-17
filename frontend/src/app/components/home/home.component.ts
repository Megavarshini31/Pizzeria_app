import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home">
      <h1>Our story</h1>
      <p>
        We believe in good. We launched Fresh Pan Pizza Best Excuse Awards on our
        Facebook fan page. Fans were given situations where they had to come up
        with wacky and fun excuses. The person with the best excuse won the
        Best Excuse Badge and won Pizzeria's vouchers.
      </p>
      <p>
        Ever since we launched the Tastiest Pan Pizza, people have not been able
        to resist the softest, cheesiest, crunchiest, butteriest Pizzeria's
        Fresh Pan Pizza.
      </p>
      
      <div class="row">
      <img src="assets/images/home/ingredients.jpg" alt="Fresh ingredients" class="section-img">
        <div class="col">
          <h2>Ingredients</h2>
          <p>We're ruthless about goodness. We have no qualms about tearing up a
             day-old lettuce leaf, or steaming a baby carrot. That's our motto —
             it makes the kitchen a better place.</p>
        </div>
      </div>

      <div class="row reverse">
        <img src="assets/images/home/our-chefs.jpg" alt="Our chefs" class="section-img">
        <div class="col">
          <h2>Our Chefs</h2>
          <p>They make sauces sing and salads dance. They create magic with skill,
             knowledge, passion, and stirring spoons. They make goodness so good,
             it doesn't know what to do with itself. We do though. We send it to you.</p>
        </div>
      </div>

      <div class="delivery">
        <img src="assets/images/home/delivery-timer.jpg" alt="45 minute delivery" class="delivery-img">
        <span>45 min delivery</span>
      </div>

      <footer>Copyrights &copy; 2026 Pizzeria. All rights reserved.</footer>
    </div>
  `,
  styles: [`
    .home { max-width: 900px; margin: 0 auto; padding: 32px 24px; }
    h1 { text-align: center; font-weight: 300; }
    p { line-height: 1.7; color: #555; }
    .row { display: flex; gap: 24px; margin: 32px 0; align-items: center; }
    .row.reverse { flex-direction: row-reverse; }
    .col { flex: 1; }
    h2 { font-weight: 400; }
    .delivery {
      display: flex; align-items: center; gap: 12px; font-size: 18px;
      margin: 32px 0;
    }
    .clock { font-size: 32px; }
    footer { text-align: center; color: #ffb300; font-size: 12px; margin-top: 40px; }
  `]
})
export class HomeComponent {}
