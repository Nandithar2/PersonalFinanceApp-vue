<script setup lang="ts">
import { ref, onMounted } from "vue";

type Transaction = {
  amount: number;
  date: string;
  category: string;
};

const transactions = ref<Transaction[]>([]);
const amount = ref<number>(0);
const date = ref<string>('');
const category = ref<string>('');

const getTransactions = async () => {
  try {
    const response = await fetch('/transactions', { method: 'GET' });
    transactions.value = await response.json();
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  }
};

const addTransaction = async () => {
  try {
    const res = await fetch('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        amount: amount.value,
        date: date.value,
        category: category.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const newTransaction = await res.json();
    transactions.value.push(newTransaction);
    resetForm();
  } catch (error) {
    console.error('Failed to add transaction:', error);
  }
};

const resetForm = () => {
  amount.value = 0;
  date.value = '';
  category.value = '';
};

const cumulative = (index: number) => {
  return transactions.value
    .slice(0, index + 1)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

onMounted(getTransactions);
</script>

<template>
  <main>
    <form id="transaction-form" @submit.prevent="addTransaction">
      <input v-model.number="amount" type="number" name="amount" placeholder="amount" required>
      <input v-model="date" type="date" name="date" placeholder="date" required>
      <select v-model="category" name="category" aria-label="Select Category" required>
        <option selected disabled value="">Select your category</option>
        <option>Bills and Utilities</option>
        <option>Charity</option>
        <option>Commute</option>
        <option>Education</option>
        <option>Entertainment</option>
        <option>Family and Pets</option>
        <option>Fees & Charges</option>
        <option>Fitness</option>
        <option>Food and Drinks</option>
        <option>Fuel</option>
        <option>Groceries</option>
        <option>Household</option>
        <option>Medical</option>
        <option>Personal Care</option>
        <option>Rent</option>
        <option>Shopping</option>
        <option>Travel</option>
      </select>
      <button type="submit">Add transaction</button>
    </form>

    <h1>Transactions</h1>
    <hr>
    <table class="striped">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Category</th>
          <th scope="col">Amount</th>
          <th scope="col">Cumulative</th>
        </tr>
      </thead>
      <tbody id="transactions">
        <tr v-for="(transaction, index) in transactions" :key="index">
          <th scope="row">{{ transaction.date }}</th>
          <td>{{ transaction.category }}</td>
          <td>{{ transaction.amount }}</td>
          <td>{{ cumulative(index) }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style>
</style>
