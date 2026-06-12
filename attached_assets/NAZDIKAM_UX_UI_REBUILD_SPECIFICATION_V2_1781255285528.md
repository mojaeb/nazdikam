# NAZDIKAM — UX/UI REBUILD SPECIFICATION
Version: 2.0
Status: Mandatory Product UX/UI Refactor

---

# Executive Summary

This document overrides previous UI decisions and defines the final UX direction for Nazdikam.

Core Principles:

- Mobile First
- Business Profile Centric
- Instagram-like Simplicity
- Consistent Mobile/Desktop Experience
- Unified Product & Service Experience
- Minimal Cognitive Load

---

# User Journey

## Guest User

Can:

- Search
- Browse categories
- View businesses
- View products
- View services
- View offers

Cannot:

- Save
- Follow
- Review

Trigger login when user attempts:

- Save
- Follow
- Review

---

## Registered User

Can:

- Save businesses
- Save products
- Save services
- Follow businesses
- Submit reviews
- Register a business

---

## Business Owner

Can:

- Manage business profile
- Manage products/services
- Manage offers
- Manage installments
- View leads
- View analytics
- Upgrade subscription

---

# Header Redesign

Header must remain minimal.

Contains only:

- Centered Nazdikam Logo

Remove:

- Login button
- Register button
- Extra navigation items

---

# Home Page Structure

1. City Selector + Search
2. Hero Banner
3. Categories
4. Featured Products & Services
5. Offers
6. Installments
7. Featured Businesses
8. Videos

Videos must never appear above core discovery content.

---

# Bottom Navigation

Mobile Sticky Navigation

Items:

- Home
- Categories
- Search
- Map
- Account

Requirements:

- Floating effect
- Blur background
- Active state animation

---

# Account Dashboard

Design Style:

- Instagram-inspired
- Simple
- Mobile-first

Navigation:

- Profile
- Saved
- Following
- My Reviews
- Notifications
- Register Business
- Logout

Use Hamburger Menu only.

---

# Business Dashboard

Use Hamburger Menu only.

Menu:

- Overview
- Products / Services
- Videos
- Offers
- Installments
- Leads
- Reviews
- Analytics
- Subscription
- Settings

Must include:

## Switch Account

User can switch between:

- Personal Account
- Business Dashboard

---

# Business Card

Display only:

- Logo
- Business Name
- City, Province
- Rating

Nothing else.

---

# Product Card

Display only:

- Image
- Title
- Discount Percentage
- Installment Count
- Final Price
- Old Price

Do not display:

- Description
- Address
- Extra metadata

---

# Service Card

Must be visually identical to Product Card.

Use one shared component.

---

# Unified Product & Service Detail Page

Products and Services must use the same detail page structure.

Order:

## 1. Image Slider

## 2. Title

## 3. Category + City + Province

## 4. Business Box

Display:

- Logo
- Business Name
- Followers Count
- Follow Button

## 5. Price Box

Display:

- Current Price
- Discount
- Old Price

## 6. Installment Box

Section A:

- Installment Count
- Installment Amount
- Total Installment Cost

Section B:

Eligible Groups

Examples:

- Women
- Men
- Retirees

Section C:

Short Conditions

## 7. CTA Buttons

- Call
- Directions

## 8. Description

## 9. Reviews

- Rating
- Review Submission

---

# Business Profile Layout

Inspired by:

- Twitter
- Instagram

Structure:

## Cover Banner

Fixed top banner

## Circular Logo

50% inside banner
50% outside banner

## Follow Button

Aligned opposite logo

## Business Name

Show verified badge when verified.

## Category

Shown below business name.

## Stats

Display:

- Followers Count
- Reviews Count

## Sticky Tab Navigation

Must remain visible during scrolling.

Tabs:

### Videos

### Products / Services

Filters:

- Products Only
- Services Only
- Both

### Contact Information

### Address & Directions

### Working Hours

### Social Links

- WhatsApp
- Telegram
- Instagram
- Website

### Reviews & Ratings

---

# Product / Service Management

Single section:

Products / Services

Capabilities:

- View All
- Create New
- Edit
- Delete

---

# Create Product / Service Form

Single shared form.

Fields:

- Title
- Description
- Images
- Category
- Price

## Discount Switch

When enabled:

- Discount Percentage
- Expiration Date

## Installment Switch

When enabled:

- Installment Count
- Installment Amount
- Total Cost
- Eligible Groups
- Conditions

---

# UX Requirements

- No ERP-style interfaces
- No accounting software feeling
- Minimal clicks
- Mobile-first interactions
- Consistent visual language

---

# Success Criteria

A new user must be able to:

1. Search
2. Find a business
3. View a product/service
4. Save it
5. Register
6. Register a business
7. Enter business dashboard

Within 5 minutes without guidance.
