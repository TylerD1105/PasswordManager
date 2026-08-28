import {getRegistrableDomain, matchesSite, normalizeSite } from '../matching/siteMatcher'
import {describe, expect, test} from 'vitest'

describe('getRegistrableDomain', () => {
    test('returns the registrable domain for valid url', () => {
        expect(getRegistrableDomain("https://www.example.com/path")).toBe("example.com")
        expect(getRegistrableDomain("http://subdomain.example.co.uk")).toBe("example.co.uk")
        expect(getRegistrableDomain("https://subdomain.github.com")).toBe("github.com")
        expect(getRegistrableDomain("https://github.com.attacker.com")).toBe("attacker.com")
    })

    test('returns null for invalid url', () => {
        expect(getRegistrableDomain("not a url")).toBe(null)
        expect(getRegistrableDomain("http://")).toBe(null)
        expect(getRegistrableDomain("https://")).toBe(null)
    })
})

describe('matchesSite', () => {
    test('returns true for matching sites', () => {
        expect(matchesSite("https://www.example.com/path", "http://example.com")).toBe(true)
        expect(matchesSite("http://subdomain.example.co.uk", "https://example.co.uk")).toBe(true)
        expect(matchesSite("https://subdomain.github.com", "https://differentsubdomain.github.com")).toBe(true)
        expect(matchesSite("https://example.com", "https://example.com")).toBe(true)
    })
    
    test('returns false for deceptive domains', () => {
        expect(matchesSite("https://github.com.attacker.com", "https://github.com")).toBe(false)
    })
    test('returns false for invalid urls', () => {
        expect(matchesSite("not a url", "https://example.com")).toBe(false)
        expect(matchesSite("https://example.com", "not a url")).toBe(false)
        expect(matchesSite("not a url", "also not a url")).toBe(false)
    })
    test('returns false for different sites', () => {
        expect(matchesSite("https://www.example.com/path", "http://different.com")).toBe(false)
        expect(matchesSite("http://subdomain.example.co.uk", "https://different.co.uk")).toBe(false)
        expect(matchesSite("https://subdomain.github.com", "https://differentgithub.com")).toBe(false)
    })
})

describe('normalizeSite', () => {
    test('normalizes sites correctly', () => {
        expect(normalizeSite("https://www.example.com/path")).toBe("www.example.com")
        expect(normalizeSite("https://subdomain.example.co.uk")).toBe("subdomain.example.co.uk")
        expect(normalizeSite("https://subdomain.Github.com")).toBe("subdomain.github.com")
        expect(normalizeSite("https://google.com:443")).toBe("google.com")
    })

    test('returns null for invalid urls', () => {
        expect(normalizeSite("not a url")).toBe(null)
        expect(normalizeSite("http://")).toBe(null)
        expect(normalizeSite("https://")).toBe(null)
        expect(normalizeSite("")).toBe(null)
    })
})
