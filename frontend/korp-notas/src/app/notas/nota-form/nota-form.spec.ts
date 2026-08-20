import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotaForm } from './nota-form';

describe('NotaForm', () => {
  let component: NotaForm;
  let fixture: ComponentFixture<NotaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(NotaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
