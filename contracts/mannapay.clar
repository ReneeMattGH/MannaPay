;; MannaPay Subscription Management Contract
;; This contract manages subscription payments and tracking

(define-constant CONTRACT-OWNER tx-sender)
(define-constant USDC-CONTRACT (as-contract (unwrap-panic (contract-call? .usdc-token get-contract-address))))

;; Data Variables
(define-data-var subscription-counter uint u0)
(define-data-var total-revenue uint u0)

;; Maps
(define-map subscriptions
  uint
  {
    user: principal,
    platform: (string-utf8 50),
    plan: (string-utf8 20),
    amount: uint,
    start-block: uint,
    end-block: uint,
    status: (string-utf8 20)
  }
)

(define-map user-subscriptions
  principal
  (list 100 uint)
)

(define-map platform-revenue
  (string-utf8 50)
  uint
)

;; Events
(define-data-event subscription-created
  (subscription-id: uint)
  (user: principal)
  (platform: (string-utf8 50))
  (amount: uint)
)

(define-data-event subscription-cancelled
  (subscription-id: uint)
  (user: principal)
  (refund-amount: uint)
)

(define-data-event payment-received
  (from: principal)
  (amount: uint)
  (platform: (string-utf8 50))
)

;; Helper Functions
(define-private (is-valid-subscription (subscription-id uint))
  (is-some (map-get? subscriptions subscription-id))
)

(define-private (is-subscription-active (subscription-id uint))
  (let ((subscription (unwrap-panic (map-get? subscriptions subscription-id))))
    (and
      (is-eq subscription.status u"active")
      (> block-height subscription.start-block)
      (< block-height subscription.end-block)
    )
  )
)

;; Public Functions

;; Create a new subscription
(define-public (create-subscription
  (platform (string-utf8 50))
  (plan (string-utf8 20))
  (amount uint)
  (duration-blocks uint)
)
  (begin
    (let (
      (subscription-id (+ (var-get subscription-counter) u1))
      (start-block block-height)
      (end-block (+ block-height duration-blocks))
    )
      (map-set subscriptions subscription-id {
        user: tx-sender,
        platform: platform,
        plan: plan,
        amount: amount,
        start-block: start-block,
        end-block: end-block,
        status: u"active"
      })
      (map-set user-subscriptions tx-sender (unwrap! (map-get? user-subscriptions tx-sender) (list)))
      (var-set subscription-counter subscription-id)
      (var-set total-revenue (+ (var-get total-revenue) amount))
      (map-set platform-revenue platform (+ (unwrap! (map-get? platform-revenue platform) u0) amount))
      (ok (print (subscription-created subscription-id tx-sender platform amount)))
    )
  )
)

;; Cancel a subscription
(define-public (cancel-subscription (subscription-id uint))
  (begin
    (asserts! (is-valid-subscription subscription-id) (err u100))
    (asserts! (is-subscription-active subscription-id) (err u101))
    (let ((subscription (unwrap-panic (map-get? subscriptions subscription-id))))
      (asserts! (is-eq subscription.user tx-sender) (err u102))
      (map-set subscriptions subscription-id (merge subscription { status: u"cancelled" }))
      (ok (print (subscription-cancelled subscription-id tx-sender u0)))
    )
  )
)

;; Get subscription details
(define-read-only (get-subscription (subscription-id uint))
  (map-get? subscriptions subscription-id)
)

;; Get user's subscriptions
(define-read-only (get-user-subscriptions (user principal))
  (map-get? user-subscriptions user)
)

;; Get platform revenue
(define-read-only (get-platform-revenue (platform (string-utf8 50)))
  (map-get? platform-revenue platform)
)

;; Get total revenue
(define-read-only (get-total-revenue)
  (ok (var-get total-revenue))
)

;; Get subscription count
(define-read-only (get-subscription-count)
  (ok (var-get subscription-counter))
)

;; Process payment (called by USDC contract)
(define-public (process-payment
  (from principal)
  (amount uint)
  (platform (string-utf8 50))
)
  (begin
    (var-set total-revenue (+ (var-get total-revenue) amount))
    (map-set platform-revenue platform (+ (unwrap! (map-get? platform-revenue platform) u0) amount))
    (ok (print (payment-received from amount platform)))
  )
)
