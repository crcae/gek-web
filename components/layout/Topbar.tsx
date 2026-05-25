import { Mail, ExternalLink } from 'lucide-react';

export function Topbar() {
  return (
    <div className="hidden md:flex items-center justify-between px-6 bg-[#0D1B24] text-brand-white h-[36px] font-lora text-[13px] relative z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Left side: Email */}
        <div className="flex items-center">
          <a
            href="mailto:info@gecvt.com"
            className="flex items-center hover:text-brand-green transition-colors"
          >
            <Mail className="w-[14px] h-[14px] mr-2" />
            <span>info@gecvt.com</span>
          </a>
        </div>

        {/* Right side: LinkedIn */}
        <div className="flex items-center">
          <a
            href="https://www.linkedin.com/company/grupo-exportador-del-campo/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-brand-green transition-colors"
          >
            <ExternalLink className="w-[14px] h-[14px] mr-2" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
}
