/// <reference types="Cypress" />

import React from 'react';
import { mount } from 'cypress-react-unit-test';

import PassedVsFailed from '../../src/components/PassedVsFailed/index';

// Test Suite - Passing props -> passed: 75, failed: 25
describe('Passed Vs Failed: props -> passed: 75, failed: 25', () => {
  const wrapper = <PassedVsFailed passed={75} failed={25} />;

  it('The Component is rendered correctly', () => {
    mount(wrapper);
    expect(wrapper.props.passed).to.equal(75);
    expect(wrapper.props.failed).to.equal(25);
  });

  it('Pass Icon is present', () => {
    mount(wrapper);
    cy.get('[data-cy=passIcon]')
      .should('have.attr', 'src')
      .should('include', './icons/Pass.png');
  });

  it('Fail Icon is present', () => {
    mount(wrapper);
    cy.get('[data-cy=failedIcon]')
      .should('have.attr', 'src')
      .should('include', './icons/Fail.png');
  });

  it('Passed Value is 75 or not', () => {
    mount(wrapper);
    cy.get('[data-cy=passedValueID]').then((text) => {
      expect(text[0].textContent).to.equal('75%');
    });
  });

  it('Failed Value is 25 or not', () => {
    mount(wrapper);
    cy.get('[data-cy=failedValueID]').then((text) => {
      expect(text[0].textContent).to.equal('25%');
    });
  });
});

// Test Suite - Passing props -> passed: 20, failed: 80
describe('Passed Vs Failed: props -> passed: 20, failed: 80', () => {
  const wrapper = <PassedVsFailed passed={20} failed={80} />;

  it('The Component is rendered correctly', () => {
    mount(wrapper);
    expect(wrapper.props.passed).to.equal(20);
    expect(wrapper.props.failed).to.equal(80);
  });

  it('Pass Icon is present', () => {
    mount(wrapper);
    cy.get('[data-cy=passIcon]')
      .should('have.attr', 'src')
      .should('include', './icons/Pass.png');
  });

  it('Fail Icon is present', () => {
    mount(wrapper);
    cy.get('[data-cy=failedIcon]')
      .should('have.attr', 'src')
      .should('include', './icons/Fail.png');
  });

  it('Passed Value is 20 or not', () => {
    mount(wrapper);
    cy.get('[data-cy=passedValueID]').then((text) => {
      expect(text[0].textContent).to.equal('20%');
    });
  });

  it('Failed Value is 80 or not', () => {
    mount(wrapper);
    cy.get('[data-cy=failedValueID]').then((text) => {
      expect(text[0].textContent).to.equal('80%');
    });
  });
});

// Test Suite - Passing props -> passed: 0, failed: 0
describe('Passed Vs Failed: props -> passed: 0, failed: 0', () => {
  const wrapper = <PassedVsFailed passed={0} failed={0} />;

  it('The Component is rendered correctly', () => {
    mount(wrapper);
    expect(wrapper.props.passed).to.equal(0);
    expect(wrapper.props.failed).to.equal(0);
  });

  it('Pass Icon is not present', () => {
    mount(wrapper);
    cy.get('[data-cy=passIcon]').should('not.exist');
  });

  it('Fail Icon is not present', () => {
    mount(wrapper);
    cy.get('[data-cy=failedIcon]').should('not.exist');
  });

  it('Passed Value is 0 or not', () => {
    mount(wrapper);
    cy.get('[data-cy=passedValueID]').then((text) => {
      expect(text[0].textContent).to.equal('0%');
    });
  });

  it('Failed Value is 0 or not', () => {
    mount(wrapper);
    cy.get('[data-cy=failedValueID]').then((text) => {
      expect(text[0].textContent).to.equal('0%');
    });
  });
});
