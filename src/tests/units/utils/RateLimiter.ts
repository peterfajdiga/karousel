tests.register("RateLimiter", 1, () => {
    const rateLimiter = new RateLimiter(3, 10);

    function testRateLimiter() {
        Assert.truth(rateLimiter.acquire());
        Assert.truth(rateLimiter.acquire());
        Assert.truth(rateLimiter.acquire());
        Assert.truth(!rateLimiter.acquire());
        Assert.truth(!rateLimiter.acquire());
    }

    testRateLimiter();
    setTimeout(() => {
        // the rate limiter interval has expired, let's test again
        testRateLimiter();
    }, 10);
});
